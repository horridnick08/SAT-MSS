'use client';

import {
  LayoutDashboard,
  Globe,
  Map,
  Layers,
  Activity,
  History,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mission-control', label: 'Mission Control', icon: Globe },
  { id: 'aois', label: 'Areas of Interest', icon: Map },
  { id: 'imagery', label: 'Satellite Imagery', icon: Layers },
  { id: 'analysis', label: 'Analysis', icon: Activity },
  { id: 'timeline', label: 'Timeline', icon: History },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Sliders },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('mission-control');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative z-20 flex h-full flex-col border-r border-[#2A3547]/50 bg-[#0D1117]/80 backdrop-blur-md transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Trigger Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-[#2A3547] bg-[#0D1117] text-[#8A9BBB] shadow-md transition-all hover:scale-105 hover:text-[#E8EAF0] active:scale-95"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation section */}
      <nav className="flex flex-grow flex-col gap-1.5 px-3 py-6">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`group relative flex w-full items-center overflow-hidden rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? 'border border-[#E88C30]/20 bg-[#E88C30]/10 font-bold text-[#E88C30]'
                  : 'border border-transparent text-[#8A9BBB] hover:bg-white/5 hover:text-[#E8EAF0]'
              }`}
            >
              {/* Highlight bar for active item */}
              {isActive && (
                <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-[#E88C30]" />
              )}

              <Icon
                className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                  collapsed ? 'mx-auto' : 'mr-3'
                }`}
              />

              {!collapsed && (
                <span className="font-display text-xs uppercase tracking-widest">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Integrity HUD Info Footer */}
      {!collapsed && (
        <div className="border-t border-[#2A3547]/30 bg-[#06080D]/40 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-[#4E5D7A]">
              <span>SECTOR</span>
              <span className="text-[#E8EAF0]">IND-MIN-01</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-[#4E5D7A]">
              <span>GRID LIMIT</span>
              <span className="text-[#E8EAF0]">LAT/LON BOUNDS</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
