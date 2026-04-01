"""
File Watcher - Real-Time Security Monitor

Watches for file changes and automatically scans for vulnerabilities.
Provides instant feedback while you code.
"""

import time
import logging
from pathlib import Path
from typing import Callable, List, Dict, Any, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent, FileCreatedEvent

logger = logging.getLogger(__name__)


class SecurityFileHandler(FileSystemEventHandler):
    """
    Handle file system events and trigger security scans.
    """

    def __init__(
        self,
        security_agent,
        telegram_alerter=None,
        callback: Callable = None,
        debounce_seconds: float = 1.0
    ):
        super().__init__()
        self.security_agent = security_agent
        self.telegram_alerter = telegram_alerter
        self.callback = callback
        self.debounce_seconds = debounce_seconds
        self._debounce_timers = {}

    def _should_scan(self, file_path: str) -> bool:
        """Check if file should be scanned"""
        path = Path(file_path)

        # Only scan specific extensions
        scannable = {'.py', '.js', '.ts', '.jsx', '.tsx', '.env', '.yaml', '.yml'}
        if path.suffix.lower() not in scannable:
            return False

        # Skip certain directories
        skip_dirs = {
            'node_modules',
            '__pycache__',
            '.git',
            '.next',
            'venv',
            'env',
            'dist',
            'build',
            '.venv',
        }

        for skip_dir in skip_dirs:
            if skip_dir in str(path):
                return False

        return True

    def _debounced_scan(self, file_path: str):
        """Debounced scan to avoid multiple rapid scans"""
        import threading

        # Cancel existing timer
        if file_path in self._debounce_timers:
            self._debounce_timers[file_path].cancel()

        # Set new timer
        timer = threading.Timer(
            self.debounce_seconds,
            self._scan_file,
            args=[file_path]
        )
        self._debounce_timers[file_path] = timer
        timer.start()

    def _scan_file(self, file_path: str):
        """Scan a single file and report findings"""
        if not self._should_scan(file_path):
            return

        logger.info(f"Scanning: {file_path}")

        findings = self.security_agent.scan_file(
            file_path,
            send_telegram_alert=True
        )

        if findings:
            critical_count = sum(1 for f in findings if f['severity'] == 'critical')
            high_count = sum(1 for f in findings if f['severity'] == 'high')

            if critical_count > 0 or high_count > 0:
                print(f"\n🚨 SECURITY ALERT: {len(findings)} issues in {file_path}")
                print(f"   Critical: {critical_count}, High: {high_count}")

                for finding in findings[:5]:  # Show first 5
                    print(f"   • [{finding['severity']}] {finding['threat_type']} at line {finding['line_number']}")

        # Call external callback if provided
        if self.callback:
            self.callback(file_path, findings)

    def on_modified(self, event):
        """Handle file modification events"""
        if isinstance(event, FileModifiedEvent):
            self._debounced_scan(event.src_path)

    def on_created(self, event):
        """Handle file creation events"""
        if isinstance(event, FileCreatedEvent):
            self._debounced_scan(event.src_path)


class FileWatcher:
    """
    Watch directories for file changes and scan automatically.
    """

    def __init__(
        self,
        security_agent,
        telegram_alerter=None,
        directories: List[str] = None,
        callback: Callable = None
    ):
        self.security_agent = security_agent
        self.telegram_alerter = telegram_alerter
        self.directories = directories or ['.']
        self.callback = callback
        self.observer = None
        self._running = False

    def start(self, blocking: bool = True):
        """
        Start watching for file changes.

        Args:
            blocking: If True, blocks indefinitely. If False, returns immediately.
        """
        handler = SecurityFileHandler(
            self.security_agent,
            self.telegram_alerter,
            self.callback
        )

        self.observer = Observer()

        for directory in self.directories:
            dir_path = Path(directory)
            if dir_path.exists():
                self.observer.schedule(handler, str(dir_path), recursive=True)
                logger.info(f"Watching: {dir_path}")

        self.observer.start()
        self._running = True

        print("🔐 Security File Watcher started")
        print("   Watching for file changes...")
        print("   Press Ctrl+C to stop")

        if blocking:
            try:
                while self._running:
                    time.sleep(1)
            except KeyboardInterrupt:
                self.stop()

    def stop(self):
        """Stop watching for file changes"""
        self._running = False

        if self.observer:
            self.observer.stop()
            self.observer.join()

        print("Security File Watcher stopped")

    def is_running(self) -> bool:
        """Check if watcher is running"""
        return self._running


def start_watcher(
    security_agent,
    telegram_alerter=None,
    directories: List[str] = None,
    callback: Callable = None
):
    """
    Convenience function to start file watcher.

    Usage:
        from security_agent import SecurityAgent
        from hooks.file_watcher import start_watcher

        agent = SecurityAgent()
        start_watcher(agent, directories=['./src'])
    """
    watcher = FileWatcher(
        security_agent,
        telegram_alerter,
        directories,
        callback
    )
    watcher.start(blocking=True)


if __name__ == '__main__':
    # Standalone usage
    import os
    from dotenv import load_dotenv
    from pathlib import Path

    load_dotenv()

    project_root = Path(__file__).parent.parent

    # Initialize security agent
    import sys
    sys.path.insert(0, str(project_root))

    from agent.security_agent import SecurityAgent
    from telegram.alerter import TelegramAlerter

    telegram = None
    if os.getenv('TELEGRAM_BOT_TOKEN') and os.getenv('TELEGRAM_CHAT_ID'):
        telegram = TelegramAlerter(
            os.getenv('TELEGRAM_BOT_TOKEN'),
            os.getenv('TELEGRAM_CHAT_ID')
        )

    agent = SecurityAgent(
        project_root=str(project_root),
        telegram_alerter=telegram
    )

    # Start watching src directory
    start_watcher(
        agent,
        telegram,
        directories=[str(project_root / 'src')]
    )
