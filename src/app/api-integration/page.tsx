'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Hint } from '@/components/ui/Hint';
import { apiKeysApi, webhooksApi } from '@/lib/api/client';
import { ApiKey, WebhookConfig } from '@/lib/api/types';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

export default function ApiIntegrationPage() {
  useProtectedRoute();

  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API Key form
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read:simulations', 'write:simulations']);
  const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);

  // Webhook form
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['simulation.completed']);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [keysData, webhooksData] = await Promise.all([
        apiKeysApi.list(),
        webhooksApi.list(),
      ]);
      setApiKeys(keysData);
      setWebhooks(webhooksData);
    } catch (error) {
      console.error('Failed to load API data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName) return;
    try {
      const newKey = await apiKeysApi.create(newKeyName, newKeyPermissions);
      setShowNewKey(newKey);
      setNewKeyName('');
      await loadData();
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await apiKeysApi.delete(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const createWebhook = async () => {
    if (!webhookUrl) return;
    try {
      await webhooksApi.create({
        url: webhookUrl,
        events: webhookEvents,
        secret: generateSecret(),
        is_active: true,
      });
      setWebhookUrl('');
      await loadData();
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const generateSecret = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">API Integration</h1>
          <p className="text-gray-600">Manage API keys and webhooks for external integrations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {([
            { key: 'keys', label: 'API Keys' },
            { key: 'webhooks', label: 'Webhooks' },
            { key: 'docs', label: 'Documentation' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-medium rounded-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Key Name"
                    placeholder="e.g., Production API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      {['read:simulations', 'write:simulations', 'read:analytics', 'admin'].map(
                        (perm) => (
                          <label key={perm} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newKeyPermissions.includes(perm)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewKeyPermissions([...newKeyPermissions, perm]);
                                } else {
                                  setNewKeyPermissions(newKeyPermissions.filter((p) => p !== perm));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{perm}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <Button onClick={createApiKey} disabled={!newKeyName}>
                    Create API Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showNewKey && (
              <Hint title="Copy Your API Key Now" className="bg-black text-white border-black">
                <div className="space-y-2">
                  <div className="font-mono bg-white/10 p-3 rounded break-all">{showNewKey.key}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => copyToClipboard(showNewKey.key)}
                    >
                      Copy to Clipboard
                    </Button>
                    <Button variant="secondary" onClick={() => setShowNewKey(null)}>
                      Done
                    </Button>
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    This key will only be shown once. Store it securely.
                  </p>
                </div>
              </Hint>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No API keys yet</div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-sm"
                      >
                        <div>
                          <div className="font-medium">{key.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {key.permissions.join(', ')}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => deleteApiKey(key.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Webhook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Webhook URL"
                    placeholder="https://your-app.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    hint="Must return 200 status code"
                  />

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Events
                    </label>
                    <div className="space-y-2">
                      {['simulation.completed', 'simulation.failed', 'user.created'].map(
                        (event) => (
                          <label key={event} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={webhookEvents.includes(event)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setWebhookEvents([...webhookEvents, event]);
                                } else {
                                  setWebhookEvents(webhookEvents.filter((e) => e !== event));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{event}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <Button onClick={createWebhook} disabled={!webhookUrl}>
                    Create Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : webhooks.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No webhooks configured</div>
                ) : (
                  <div className="space-y-4">
                    {webhooks.map((hook) => (
                      <div
                        key={hook.id}
                        className="p-4 border border-gray-200 rounded-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium truncate max-w-md">{hook.url}</div>
                          <div
                            className={`px-2 py-1 text-xs rounded ${
                              hook.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {hook.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Events: {hook.events.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">API Documentation</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Base URL</h4>
                    <code className="bg-gray-100 px-3 py-2 rounded block">
                      {API_BASE_URL}
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Authentication</h4>
                    <p className="text-gray-600 mb-2">
                      Include your API key in the Authorization header:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      {`Authorization: Bearer your_api_key_here`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Endpoints</h4>

                    <div className="space-y-4">
                      {[
                        {
                          method: 'GET',
                          path: '/simulations',
                          desc: 'List all simulations',
                        },
                        {
                          method: 'POST',
                          path: '/simulations',
                          desc: 'Create a new simulation',
                        },
                        {
                          method: 'GET',
                          path: '/simulations/{id}',
                          desc: 'Get simulation details',
                        },
                        {
                          method: 'GET',
                          path: '/simulations/{id}/stream',
                          desc: 'Stream simulation progress (SSE)',
                        },
                      ].map((endpoint, i) => (
                        <div key={i} className="border-l-4 border-black pl-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-green-600">
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-sm">{endpoint.path}</span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{endpoint.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example Request</h4>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                      {`curl -X POST ${API_BASE_URL}/simulations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_name": "My App",
    "product_description": "A helpful tool",
    "target_market": "Small businesses",
    "pricing_model": "subscription",
    "price_point": "$29/month"
  }'`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v2';
