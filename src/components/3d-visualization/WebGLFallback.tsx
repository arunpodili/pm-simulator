'use client';

import { AlertTriangle, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WebGLFallbackProps {
  agentCount: number;
}

export function WebGLFallback({ agentCount }: WebGLFallbackProps) {
  return (
    <div className="glass-elevated rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-gold" />
      </div>

      <h3 className="text-xl font-bold mb-2">3D Visualization Unavailable</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Your browser or device doesn't support WebGL, which is required for the
        3D agent visualization with {agentCount.toLocaleString()} agents.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View 2D Summary
        </Button>
        <Button className="btn-gold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Results
        </Button>
      </div>
    </div>
  );
}
