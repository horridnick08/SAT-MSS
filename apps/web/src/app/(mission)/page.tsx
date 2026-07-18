'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function MissionControlHome() {
  const router = useRouter();
  const { user, clearCredentials } = useAuthStore();

  const handleLogout = () => {
    clearCredentials();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[#06080D] text-[#E8EAF0] p-8 font-sans">
      <header className="flex justify-between items-center border-b border-[#2A3547] pb-4 mb-8">
        <div className="flex flex-col">
          <h1 className="font-display text-xl tracking-[0.2em] text-[#E8EAF0]">SAT-MSS</h1>
          <span className="font-mono text-[10px] text-[#8A9BBB] tracking-widest uppercase">
            Satellite Mining Surveillance System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-[#E8EAF0]">{user?.name}</span>
            <span className="font-mono text-[9px] text-[#8A9BBB] tracking-wider uppercase">
              {user?.role} · {user?.organization}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="border border-[#C94040]/30 hover:bg-[#C94040]/10 text-[#C94040] text-[10px] tracking-wider font-mono uppercase px-3 py-1.5 rounded"
          >
            Disconnect Link
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="glass-mid max-w-xl w-full rounded-lg p-8 border border-white/5 text-center">
          <div className="h-12 w-12 rounded-full border border-[#E88C30]/50 flex items-center justify-center mx-auto mb-6">
            <div className="h-4 w-4 rounded-full bg-[#E88C30] animate-pulse" />
          </div>
          <h2 className="font-display text-md tracking-[0.15em] mb-3 text-[#E8EAF0]">
            ESTABLISHED REAL-TIME SECURE ORBITAL LINK
          </h2>
          <p className="text-xs text-[#8A9BBB] leading-relaxed mb-6">
            Welcome to the SAT-MSS Mission Control. The platform foundation is successfully deployed.
            Admin and Analyst links are active. In the next sprint, we will render the 3D Cesium globe navigation interface.
          </p>
          <div className="flex justify-center gap-4 font-mono text-[10px] text-[#4E5D7A]">
            <span>ENV: {process.env['NODE_ENV'] ?? 'development'}</span>
            <span>·</span>
            <span>API: OK</span>
            <span>·</span>
            <span>WS: ONLINE</span>
          </div>
        </div>
      </main>

      <footer className="text-center font-mono text-[9px] text-[#4E5D7A] tracking-widest mt-8">
        SAT-MSS PLATFORM FOUNDATION VERSION 1.0.0 · DESIGN PRIVILEGED
      </footer>
    </div>
  );
}
