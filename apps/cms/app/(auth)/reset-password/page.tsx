'use client';

import React, { useState, useEffect } from 'react';
import { authApi } from '@/core/api/auth.api';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    setStatus('loading');
    try {
      await authApi.resetPassword({ token: token!, password });
      setStatus('success');
      setMessage('Password reset successfully. You can now log in.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 'Failed to reset password. Token may be expired.',
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted text-sm">Enter your new password below</p>
      </div>

      {status === 'success' ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm text-green-600">{message}</p>
          <p className="text-muted mt-2 text-xs">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-foreground text-sm leading-none font-medium">New Password</label>
            <input
              type="password"
              required
              disabled={!token}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-foreground text-sm leading-none font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          {status === 'error' && <p className="text-sm text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={status === 'loading' || !token}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium shadow transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      <div className="mt-4 text-center">
        <Link href="/login" className="text-primary text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
