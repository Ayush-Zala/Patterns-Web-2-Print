'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem('shopifyApiKey') || '');
    setApiSecret(localStorage.getItem('shopifyApiSecret') || '');
  }, []);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, apiSecret }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed');
      }

      const data = await res.json();
      if (data.success) {
        setStatus('Connected Successfully');
        localStorage.setItem('shopifyApiKey', apiKey);
        localStorage.setItem('shopifyApiSecret', apiSecret);
      }
    } catch (e: any) {
      setStatus('Connection Failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 400, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Storefront Settings</h2>
        <Link href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
          Back to Store
        </Link>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 'bold' }}>
            API Key
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
            placeholder="pk_..."
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 'bold' }}>
            API Secret
          </label>
          <input
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
            placeholder="sk_..."
          />
        </div>

        <button
          onClick={handleTestConnection}
          disabled={loading || !apiKey || !apiSecret}
          style={{
            padding: '10px 16px',
            background: loading ? '#ccc' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {status && (
          <div
            style={{
              padding: 12,
              borderRadius: 4,
              background: status.includes('Failed') ? '#fee' : '#efe',
              color: status.includes('Failed') ? 'red' : 'green',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
