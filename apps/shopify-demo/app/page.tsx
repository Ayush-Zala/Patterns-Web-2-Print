'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiKey = localStorage.getItem('shopifyApiKey');
    const apiSecret = localStorage.getItem('shopifyApiSecret');

    if (!apiKey || !apiSecret) {
      setError('Credentials not found. Please configure in settings.');
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        // Authenticate first
        const authRes = await fetch('http://localhost:3000/api/v1/auth/shopify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, apiSecret }),
        });

        if (!authRes.ok) throw new Error('Authentication failed');
        const authData = await authRes.json();
        const token = authData.data.accessToken;

        // Fetch products
        const prodRes = await fetch('http://localhost:3000/api/v1/storefront/products', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-api-key': apiKey, // In case rate limit guard needs it
          },
        });

        if (!prodRes.ok) throw new Error('Failed to fetch products');
        const prodData = await prodRes.json();
        setProducts(prodData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading storefront...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Shopify Storefront (Live API)</h1>
        <Link
          href="/settings"
          style={{
            padding: '8px 16px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Settings
        </Link>
      </header>

      {error ? (
        <div style={{ color: 'red', padding: 20, background: '#fee', borderRadius: 8 }}>
          {error}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {products.map((p: any) => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
              )}
              <h3 style={{ margin: '10px 0 5px' }}>{p.title}</h3>
              <p style={{ color: '#666', fontSize: 14 }}>${p.price}</p>
            </div>
          ))}
          {products.length === 0 && <p>No products found.</p>}
        </div>
      )}
    </div>
  );
}
