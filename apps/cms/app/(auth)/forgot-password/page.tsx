'use client';

import React, { useState } from 'react';
import { authApi } from '@/core/api/auth.api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.data.message || 'If an account exists, a reset link has been sent.');
      setStatus('success');
    } catch (error) {
      // Still show success to prevent enumeration
      setMessage('If an account exists, a reset link has been sent.');
      setStatus('success');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-muted text-sm">Enter your email to receive a reset link</p>
      </div>

      {status === 'success' ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950/20">
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          <Link
            href="/login"
            className="text-primary mt-4 inline-block text-sm font-medium hover:underline"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-foreground text-sm leading-none font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="border-input bg-background placeholder:text-muted focus:ring-ring focus:border-input flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-muted hover:text-foreground inline-flex items-center text-sm font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
