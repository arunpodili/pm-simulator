'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { FormatSelector, ExportFormat } from './FormatSelector';
import { useExport } from '@/hooks/useExport';
import { FileText, CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    simulation: any;
    personas: any[];
    structuredData?: any;
  };
}

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [notionToken, setNotionToken] = useState('');
  const [googleToken, setGoogleToken] = useState('');
  const { startExport, reset, status, progress, error, result, isExporting } = useExport();

  const handleExport = useCallback(async () => {
    if (!selectedFormat) return;

    await startExport(selectedFormat, data, {
      notionToken: notionToken || undefined,
      googleToken: googleToken || undefined,
    });
  }, [selectedFormat, data, notionToken, googleToken, startExport]);

  const handleClose = useCallback(() => {
    reset();
    setSelectedFormat(null);
    onClose();
  }, [reset, onClose]);

  const isExternal = selectedFormat === 'notion' || selectedFormat === 'google-docs';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Simulation Report</DialogTitle>
        </DialogHeader>

        {status === 'idle' && (
          <div className="space-y-6">
            <FormatSelector selectedFormat={selectedFormat} onSelect={setSelectedFormat} />

            {selectedFormat === 'notion' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Notion API Token</label>
                <input
                  type="password"
                  value={notionToken}
                  onChange={(e) => setNotionToken(e.target.value)}
                  placeholder="secret_..."
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-gray-500">
                  Get your token from{' '}
                  <a
                    href="https://www.notion.so/my-integrations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    notion.so/my-integrations
                  </a>
                </p>
              </div>
            )}

            {selectedFormat === 'google-docs' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Access Token</label>
                <input
                  type="password"
                  value={googleToken}
                  onChange={(e) => setGoogleToken(e.target.value)}
                  placeholder="ya29..."
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-gray-500">
                  Requires Google OAuth with docs scope
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={!selectedFormat}>
                {selectedFormat === 'pdf' ? (
                  <PDFGenerator data={data}>
                    {({ loading }) => (
                      <span>{loading ? 'Generating...' : 'Export to PDF'}</span>
                    )}
                  </PDFGenerator>
                ) : (
                  'Export'
                )}
              </Button>
            </div>
          </div>
        )}

        {(status === 'generating' || status === 'uploading') && (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <p className="text-center text-gray-600">
              {status === 'generating' ? 'Generating report...' : 'Uploading...'}
            </p>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {status === 'complete' && (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-center text-lg font-medium">Export Complete!</p>

            {result?.url && isExternal && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
              >
                Open in {selectedFormat === 'notion' ? 'Notion' : 'Google Docs'}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            <div className="flex justify-center">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <p className="text-center text-lg font-medium text-red-600">Export Failed</p>
            <p className="text-center text-sm text-gray-600">{error}</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={reset}>Try Again</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
