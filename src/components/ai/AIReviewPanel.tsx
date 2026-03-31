'use client';

import { useState } from 'react';

interface ReviewResult {
  qa_review?: any;
  security_review?: any;
  result?: any;
  error?: string;
}

interface AIReviewPanelProps {
  code: string;
  filePath?: string;
  reviewType?: 'code' | 'security' | 'both';
}

export function AIReviewPanel({ code, filePath = 'current-file', reviewType = 'both' }: AIReviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'qa' | 'security'>('qa');

  const handleReview = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = reviewType === 'security' ? '/api/ai/security-scan' : '/api/ai/code-review';
      const payload = reviewType === 'security'
        ? { file_paths: [filePath] }
        : { code, file_path: filePath };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Review failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-review-panel border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          AI Review
        </h3>
        <button
          onClick={handleReview}
          disabled={isLoading}
          className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Reviewing...' : 'Run Review'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          {reviewType === 'both' && result.qa_review && result.security_review && (
            <div className="flex gap-2 mb-4 border-b">
              <button
                onClick={() => setActiveTab('qa')}
                className={`px-3 py-1.5 text-sm rounded-t ${
                  activeTab === 'qa'
                    ? 'bg-white border border-b-0 border-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                QA Review
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 text-sm rounded-t ${
                  activeTab === 'security'
                    ? 'bg-white border border-b-0 border-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Security Scan
              </button>
            </div>
          )}

          <div className="bg-white rounded border border-gray-200 p-4 max-h-96 overflow-auto">
            {activeTab === 'qa' && result.qa_review && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">QA Review Results</h4>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(result.qa_review, null, 2)}
                </pre>
              </div>
            )}
            {activeTab === 'security' && result.security_review && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Security Scan Results</h4>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(result.security_review, null, 2)}
                </pre>
              </div>
            )}
            {result.result && !result.qa_review && !result.security_review && (
              <div className="space-y-3">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !error && (
        <p className="text-sm text-gray-500 text-center py-8">
          Click &quot;Run Review&quot; to analyze with AI agents
        </p>
      )}
    </div>
  );
}
