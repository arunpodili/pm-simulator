/**
 * useExport hook - Manage export state and operations
 */
import { useState, useCallback } from 'react';
import { downloadDocx } from '@/lib/export/docx-generator';
import { exportToNotion } from '@/lib/export/notion-client';
import { exportToGoogleDocs } from '@/lib/export/google-docs-client';

type ExportFormat = 'pdf' | 'docx' | 'notion' | 'google-docs';

interface ExportState {
  format: ExportFormat | null;
  status: 'idle' | 'generating' | 'uploading' | 'complete' | 'error';
  progress: number;
  error: string | null;
  result: { url?: string; downloadUrl?: string } | null;
}

export function useExport() {
  const [state, setState] = useState<ExportState>({
    format: null,
    status: 'idle',
    progress: 0,
    error: null,
    result: null,
  });

  const startExport = useCallback(async (
    format: ExportFormat,
    data: any,
    options?: { notionToken?: string; googleToken?: string }
  ) => {
    setState({
      format,
      status: 'generating',
      progress: 0,
      error: null,
      result: null,
    });

    try {
      switch (format) {
        case 'pdf':
          // PDF is handled by PDFDownloadLink component
          setState({
            format,
            status: 'complete',
            progress: 100,
            error: null,
            result: null,
          });
          break;

        case 'docx':
          await downloadDocx(data);
          setState({
            format,
            status: 'complete',
            progress: 100,
            error: null,
            result: null,
          });
          break;

        case 'notion':
          if (!options?.notionToken) {
            throw new Error('Notion API token required');
          }
          setState((prev) => ({ ...prev, status: 'uploading', progress: 50 }));
          const notionResult = await exportToNotion(data, {
            apiToken: options.notionToken!,
          });
          setState({
            format,
            status: 'complete',
            progress: 100,
            error: null,
            result: { url: notionResult.url },
          });
          break;

        case 'google-docs':
          if (!options?.googleToken) {
            throw new Error('Google access token required');
          }
          setState((prev) => ({ ...prev, status: 'uploading', progress: 50 }));
          const googleResult = await exportToGoogleDocs(data, {
            accessToken: options.googleToken!,
          });
          setState({
            format,
            status: 'complete',
            progress: 100,
            error: null,
            result: { url: googleResult.url },
          });
          break;
      }
    } catch (err) {
      setState({
        format,
        status: 'error',
        progress: 0,
        error: err instanceof Error ? err.message : 'Export failed',
        result: null,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      format: null,
      status: 'idle',
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    startExport,
    reset,
    isExporting: state.status === 'generating' || state.status === 'uploading',
    isComplete: state.status === 'complete',
    hasError: state.status === 'error',
  };
}
