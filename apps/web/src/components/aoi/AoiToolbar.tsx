'use client';

import React from 'react';
import { useAoiStore } from '@/stores/useAoiStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Edit3, X, AlertTriangle } from 'lucide-react';

export default function AoiToolbar() {
  const isDrawing = useAoiStore((state) => state.isDrawing);
  const startDrawing = useAoiStore((state) => state.startDrawing);
  const cancelDrawing = useAoiStore((state) => state.cancelDrawing);
  const activePoints = useAoiStore((state) => state.activePoints);
  const selectedAoiId = useAoiStore((state) => state.selectedAoiId);
  const isEditing = useAoiStore((state) => state.isEditing);
  const startEditing = useAoiStore((state) => state.startEditing);
  const selectAoi = useAoiStore((state) => state.selectAoi);
  const validationError = useAoiStore((state) => state.validationError);
  const cancelEditing = useAoiStore((state) => state.cancelEditing);
  const aois = useAoiStore((state) => state.aois);

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const selectedAoi = aois.find((a) => a.id === selectedAoiId);

  return (
    <div className="absolute left-6 top-6 z-20 flex items-center gap-3">
      {isDrawing ? (
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
      ) : selectedAoiId ? (
        isEditing ? (
          /* Editing Mode Toolbar */
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0D1117]/85 backdrop-blur-md p-1.5 pl-4 pr-1.5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-left">
              {validationError ? (
                <AlertTriangle className="h-4 w-4 text-[#C94040] shrink-0 animate-pulse" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E88C30]"></span>
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-mono text-[9px] tracking-widest text-[#E8EAF0] uppercase leading-none font-bold">
                  Editing: {selectedAoi?.name}
                </span>
                <span className={`font-sans text-[8px] mt-0.5 leading-none ${validationError ? 'text-[#C94040] font-semibold' : 'text-[#8A9BBB]'}`}>
                  {validationError || 'Drag vertex handles to modify shape'}
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-white/10 mx-1.5" />

            <button
              onClick={cancelEditing}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[#E8EAF0] text-[9px] font-bold font-mono uppercase px-3 py-1.5 transition-all active:scale-95"
              title="Cancel Editing (Esc)"
            >
              <X className="h-3.5 w-3.5" />
              Cancel (Esc)
            </button>
          </div>
        ) : (
          /* Read-Only / View Mode Toolbar */
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0D1117]/85 backdrop-blur-md p-1.5 pl-4 pr-1.5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-left">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1AABB0]"></span>
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] tracking-widest text-[#E8EAF0] uppercase leading-none font-bold">
                  {selectedAoi?.name}
                </span>
                <span className="font-sans text-[8px] text-[#8A9BBB] mt-0.5 leading-none">
                  {selectedAoi?.districtName}, {selectedAoi?.stateName} · {selectedAoi?.areaHa ? `${selectedAoi.areaHa} ha` : 'N/A'} · Priority: {selectedAoi?.priority}
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-white/10 mx-1.5" />

            {isAdmin && (
              <>
                <button
                  onClick={startEditing}
                  className="flex items-center gap-1.5 rounded-md border border-[#E88C30]/30 bg-[#E88C30]/10 hover:bg-[#E88C30]/20 text-[#E88C30] text-[9px] font-bold font-mono uppercase px-3 py-1.5 transition-all active:scale-95"
                  title="Edit AOI Geometry"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Geometry
                </button>
                <div className="h-5 w-px bg-white/10 mx-1.5" />
              </>
            )}

            <button
              onClick={() => selectAoi(null)}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[#E8EAF0] text-[9px] font-bold font-mono uppercase px-3 py-1.5 transition-all active:scale-95"
              title="Close Panel"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </button>
          </div>
        )
      ) : (
        <button
          onClick={startDrawing}
          className="flex items-center gap-2 rounded-lg border border-[#E88C30]/30 bg-[#E88C30]/10 hover:bg-[#E88C30]/20 text-[#E88C30] text-xs font-semibold px-4 py-2.5 shadow-lg active:scale-95 transition-all font-mono uppercase tracking-wider"
        >
          <Edit3 className="h-4 w-4" />
          Draw AOI
        </button>
      )}
    </div>
  );
}
