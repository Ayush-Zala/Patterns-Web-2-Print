'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      toast.success('Password changed successfully');
      router.push('/dashboard');
    } catch {
      // Error is mapped centrally
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">Change Password</h1>
        <p className="text-muted mt-1 text-xs">Update your password to keep your account secure</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-foreground block text-xs font-medium">Current Password</label>
          <input
            {...register('currentPassword')}
            type="password"
            autoFocus
            placeholder="••••••••"
            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-[11px] text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="text-foreground block text-xs font-medium">New Password</label>
          <div className="relative mt-1">
            <input
              {...register('newPassword')}
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
          {errors.newPassword && (
            <p className="mt-1 text-[11px] text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="text-foreground block text-xs font-medium">Confirm New Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <span>Change Password</span>
          )}
        </button>
      </form>
    </div>
  );
}
