'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiClient } from '@/lib/api/client';
import type { ILoginRequest } from '@satmss/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();

  const onSubmit = async (data: ILoginRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { token, user } = response.data.data;
      setCredentials(token, user);
      router.push('/');
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message || 'Invalid email or password. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#06080D] px-4">
      {/* Ambient background visual matching the PXD splash screen */}
      <div className="absolute h-[600px] w-[600px] rounded-full bg-[#1AABB0]/5 blur-[120px]" />
      <div className="absolute h-[400px] w-[400px] rounded-full bg-[#E88C30]/5 blur-[100px] translate-x-20 -translate-y-20" />

      <div className="glass-deep z-10 w-full max-w-md rounded-xl p-8 border border-white/5">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-[0.15em] text-[#E8EAF0]">SAT-MSS</h1>
          <p className="font-display text-xs tracking-widest text-[#8A9BBB] mt-2 uppercase">
            Mission Control Portal
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-md bg-[#C94040]/10 border border-[#C94040]/30 p-3 text-xs text-[#C94040]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A9BBB] mb-2">
              Security Email
            </label>
            <input
              type="email"
              placeholder="analyst.mehta@satmss.gov.in"
              className="glass-input w-full rounded px-4 py-3 text-sm focus:outline-none"
              {...register('register' in register ? 'email' : 'email', {
                required: 'Security email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-[10px] text-[#C94040] mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A9BBB] mb-2">
              Passcode
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="glass-input w-full rounded px-4 py-3 text-sm focus:outline-none"
              {...register('password', { required: 'Passcode is required' })}
            />
            {errors.password && (
              <span className="text-[10px] text-[#C94040] mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glass-btn-primary flex w-full items-center justify-center rounded py-3 text-xs tracking-widest uppercase hover:bg-[#F5A042] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Establish Link'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-[#4E5D7A] tracking-wider font-mono">
          SECURE CHANNEL · NRSC · ISRO · MINISTRY OF MINES
        </div>
      </div>
    </div>
  );
}
