'use client';

import React, { useState } from 'react';
import { useAoiStore } from '@/stores/useAoiStore';
import { INDIA_STATE_CODES } from '@satmss/shared-constants';
import { MapPin, AlertCircle, Save, X, Loader2 } from 'lucide-react';

export default function AoiConfirmationForm() {
  const pendingDraft = useAoiStore((state) => state.pendingDraft);
  const saveDraft = useAoiStore((state) => state.saveDraft);
  const discardDraft = useAoiStore((state) => state.discardDraft);
  const isLoading = useAoiStore((state) => state.isLoading);
  const storeError = useAoiStore((state) => state.error);

  const [name, setName] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!pendingDraft) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('AOI name is required.');
      return;
    }
    if (!stateCode) {
      setValidationError('Please select a state.');
      return;
    }
    if (!districtName.trim()) {
      setValidationError('District name is required.');
      return;
    }

    try {
      const details: {
        name: string;
        stateCode: string;
        districtName: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        notes?: string;
      } = {
        name: name.trim(),
        stateCode,
        districtName: districtName.trim(),
        priority,
      };

      if (notes.trim()) {
        details.notes = notes.trim();
      }

      await saveDraft(details);
      // Clear fields on success
      setName('');
      setStateCode('');
      setDistrictName('');
      setPriority('MEDIUM');
      setNotes('');
    } catch (err: any) {
      // Error handled by store
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#06080D]/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0D1117]/90 backdrop-blur-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E88C30]/10 text-[#E88C30]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-sm tracking-widest text-[#E8EAF0] uppercase font-bold">
                Configure Area of Interest
              </h2>
              <p className="font-sans text-[10px] text-[#8A9BBB] mt-0.5">
                Save the drawn boundary to the central catalog for monitoring.
              </p>
            </div>
          </div>
          <button
            onClick={discardDraft}
            className="text-[#8A9BBB] hover:text-[#E8EAF0] transition-colors p-1"
            title="Discard Draft"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Errors */}
        {(validationError || storeError) && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#C94040]/30 bg-[#C94040]/5 p-3 text-xs text-[#C94040]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">{validationError || storeError}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-widest text-[#8A9BBB] uppercase font-bold">
              AOI Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Keonjhar Iron Ore Sector A"
              className="w-full rounded-lg border border-white/5 bg-[#06080D]/50 px-3.5 py-2 text-xs text-[#E8EAF0] placeholder-[#4E5D7A] focus:border-[#E88C30]/50 focus:outline-none transition-all"
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* State selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] tracking-widest text-[#8A9BBB] uppercase font-bold">
                State
              </label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full rounded-lg border border-white/5 bg-[#06080D]/50 px-3.5 py-2 text-xs text-[#E8EAF0] focus:border-[#E88C30]/50 focus:outline-none transition-all"
                disabled={isLoading}
              >
                <option value="" className="bg-[#0D1117] text-[#4E5D7A]">
                  Select State
                </option>
                {Object.entries(INDIA_STATE_CODES).map(([code, label]) => (
                  <option key={code} value={code} className="bg-[#0D1117] text-[#E8EAF0]">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* District input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] tracking-widest text-[#8A9BBB] uppercase font-bold">
                District
              </label>
              <input
                type="text"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                placeholder="e.g. Keonjhar"
                className="w-full rounded-lg border border-white/5 bg-[#06080D]/50 px-3.5 py-2 text-xs text-[#E8EAF0] placeholder-[#4E5D7A] focus:border-[#E88C30]/50 focus:outline-none transition-all"
                maxLength={100}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] tracking-widest text-[#8A9BBB] uppercase font-bold">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-lg border border-white/5 bg-[#06080D]/50 px-3.5 py-2 text-xs text-[#E8EAF0] focus:border-[#E88C30]/50 focus:outline-none transition-all"
                disabled={isLoading}
              >
                <option value="HIGH" className="bg-[#0D1117] text-[#C94040]">
                  High
                </option>
                <option value="MEDIUM" className="bg-[#0D1117] text-[#E88C30]">
                  Medium
                </option>
                <option value="LOW" className="bg-[#0D1117] text-[#2D8653]">
                  Low
                </option>
              </select>
            </div>

            {/* Geometry stats info */}
            <div className="flex flex-col justify-end p-2.5 rounded-lg border border-white/5 bg-[#06080D]/30 font-mono text-[9px] tracking-wider text-[#8A9BBB]">
              <div>VERTICES: {pendingDraft.points.length}</div>
              <div className="mt-1">SYS REF: WGS84 EPSG:4326</div>
            </div>
          </div>

          {/* Notes area */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] tracking-widest text-[#8A9BBB] uppercase font-bold">
              Descriptive Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide background information, primary mineral types, or surveillance reasons..."
              rows={3}
              className="w-full rounded-lg border border-white/5 bg-[#06080D]/50 px-3.5 py-2 text-xs text-[#E8EAF0] placeholder-[#4E5D7A] focus:border-[#E88C30]/50 focus:outline-none transition-all resize-none"
              maxLength={2000}
              disabled={isLoading}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={discardDraft}
              className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-[#8A9BBB] hover:text-[#E8EAF0] transition-all active:scale-95 disabled:opacity-50"
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#E88C30] hover:bg-[#E88C30]/90 text-xs font-semibold text-black rounded-lg transition-all active:scale-95 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Area
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
