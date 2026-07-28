'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/auth-provider';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(values.email, values.password, values.rememberMe || false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Sign In to Patterns
        </h1>
        <p className="text-muted mt-1 text-xs">
          Enter your credentials to access your CMS workspace
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-foreground block text-xs font-medium">Email Address</label>
          <input
            {...register('email')}
            type="email"
            autoFocus
            placeholder="ayush.zala@patterns247.net"
            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-foreground block text-xs font-medium">Password</label>
            <Link
              href="/forgot-password"
              className="text-muted hover:text-foreground text-[11px] font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary w-full rounded-md border px-3 py-2 pr-10 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="border-border text-primary focus:ring-primary h-3.5 w-3.5 rounded"
          />
          <label htmlFor="rememberMe" className="text-muted text-xs">
            Remember me on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}
