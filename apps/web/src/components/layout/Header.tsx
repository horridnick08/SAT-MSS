'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Bell, Settings, LogOut, Radio, User } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, clearCredentials } = useAuthStore();

  const handleLogout = () => {
    clearCredentials();
    router.push('/login');
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-[#2A3547]/50 bg-[#06080D]/90 backdrop-blur-md px-6 z-30">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E88C30]/30 bg-[#E88C30]/5 text-[#E88C30] shadow-[0_0_15px_rgba(232,140,48,0.15)]">
          <Radio className="h-5 w-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-base font-bold tracking-[0.2em] text-[#E8EAF0] leading-none">
            SAT-MSS
          </span>
          <span className="font-mono text-[9px] text-[#8A9BBB] tracking-widest uppercase mt-1 leading-none">
            Satellite Mining Surveillance System
          </span>
        </div>
      </div>

      {/* Action panel & User metadata */}
      <div className="flex items-center gap-6">
        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#2A3547]/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C2333] border border-[#2D3A52] text-[#8A9BBB]">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#E8EAF0] leading-none">{user?.name}</span>
            <span className="font-mono text-[8px] text-[#8A9BBB] tracking-wider uppercase mt-1 leading-none">
              {user?.role} · {user?.organization}
            </span>
          </div>
        </div>

        {/* HUD control icons */}
        <div className="flex items-center gap-2">
          {/* Notifications Placeholder */}
          <button
            title="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[#8A9BBB] hover:border-white/5 hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95 transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#E88C30] shadow-[0_0_8px_rgba(232,140,48,0.6)]" />
          </button>

          {/* Settings Placeholder */}
          <button
            title="Control panel settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[#8A9BBB] hover:border-white/5 hover:bg-white/5 hover:text-[#E8EAF0] active:scale-95 transition-all"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Disconnect button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-[#C94040]/30 bg-[#C94040]/5 hover:bg-[#C94040]/15 text-[#C94040] text-[10px] tracking-wider font-mono uppercase px-4.5 py-2 transition-all active:scale-95 font-bold"
        >
          <LogOut className="h-3.5 w-3.5" />
          Disconnect Link
        </button>
      </div>
    </header>
  );
}
