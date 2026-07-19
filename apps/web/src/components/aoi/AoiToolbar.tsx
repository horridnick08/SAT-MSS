'use client';

import React from 'react';
import { useAoiStore } from '@/stores/useAoiStore';
import { Edit3, X } from 'lucide-react';

export default function AoiToolbar() {
  const isDrawing = useAoiStore((state) => state.isDrawing);
  const startDrawing = useAoiStore((state) => state.startDrawing);
  const cancelDrawing = useAoiStore((state) => state.cancelDrawing);
  const activePoints = useAoiStore((state) => state.activePoints);

  return (
    <div className="absolute left-6 top-6 z-20 flex items-center gap-3">
      {!isDrawing ? (
        <button
          onClick={startDrawing}
          className="flex items-center gap-2 rounded-lg border border-[#E88C30]/30 bg-[#E88C30]/10 hover:bg-[#E88C30]/20 text-[#E88C30] text-xs font-semibold px-4 py-2.5 shadow-lg active:scale-95 transition-all font-mono uppercase tracking-wider"
        >
          <Edit3 className="h-4 w-4" />
          Draw AOI
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0D1117]/85 backdrop-blur-md p-1.5 pl-4 pr-1.5 shadow-2xl">
          <div className="flex items-center gap-2 text-left">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E88C30] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E88C30]"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] tracking-widest text-[#E8EAF0] uppercase leading-none font-bold">
                Drawing Active
              </span>
              <span className="font-sans text-[8px] text-[#8A9BBB] mt-0.5 leading-none">
                {activePoints.length} vertices placed · Left-click to place, Double-click to close
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 mx-1.5" />

          <button
            onClick={cancelDrawing}
            className="flex items-center gap-1.5 rounded-md border border-[#C94040]/30 bg-[#C94040]/5 hover:bg-[#C94040]/15 text-[#C94040] text-[9px] font-bold font-mono uppercase px-3 py-1.5 transition-all active:scale-95"
            title="Cancel Drawing (Esc)"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
