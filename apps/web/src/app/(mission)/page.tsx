'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import AoiToolbar from '@/components/aoi/AoiToolbar';
import AoiConfirmationForm from '@/components/aoi/AoiConfirmationForm';
import { useAoiStore } from '@/stores/useAoiStore';

// Dynamically import GlobeViewer with SSR disabled to prevent server-side rendering issues
const GlobeViewer = dynamic(
  () => import('@/components/cesium/GlobeViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#06080D] text-[#8A9BBB]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E88C30] border-t-transparent" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
            COMMENCING ORBITAL SIMULATOR LINK...
          </span>
        </div>
      </div>
    ),
  }
);

export default function MissionControlHome() {
  const loadAois = useAoiStore((state) => state.loadAois);

  // Load persisted AOIs from the API on mount
  useEffect(() => {
    loadAois();
  }, [loadAois]);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#06080D] text-[#E8EAF0] overflow-hidden font-sans">
      {/* Top HUD Workspace Header */}
      <Header />
      
      {/* Mid Workspace containing Navigation and GIS Globe */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Collapsible Left Navigation Control Panel */}
        <Sidebar />
        
        {/* Fullscreen Cesium Viewport */}
        <main className="flex-1 h-full relative bg-[#06080D]">
          <AoiToolbar />
          <AoiConfirmationForm />
          <GlobeViewer />
        </main>
      </div>

      {/* System Integrity & Connection Status Bar */}
      <StatusBar />
    </div>
  );
}
