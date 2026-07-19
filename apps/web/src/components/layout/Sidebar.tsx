'use client';

import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

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
      className={`relative flex flex-col h-full bg-[#0D1117]/80 backdrop-blur-md border-r border-[#2A3547]/50 transition-all duration-300 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Trigger Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-[#2A3547] bg-[#0D1117] text-[#8A9BBB] hover:text-[#E8EAF0] shadow-md z-30 transition-all hover:scale-105 active:scale-95"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Navigation section */}
      <nav className="flex-grow py-6 flex flex-col gap-1.5 px-3">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center w-full rounded-lg px-3 py-3 transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-[#E88C30]/10 text-[#E88C30] border border-[#E88C30]/20 font-bold'
                  : 'text-[#8A9BBB] hover:bg-white/5 hover:text-[#E8EAF0] border border-transparent'
              }`}
            >
              {/* Highlight bar for active item */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E88C30] rounded-r-md" />
              )}
              
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                  collapsed ? 'mx-auto' : 'mr-3'
                }`}
              />

              {!collapsed && (
                <span className="text-xs font-display tracking-widest uppercase">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Integrity HUD Info Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#2A3547]/30 bg-[#06080D]/40">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#4E5D7A]">
              <span>SECTOR</span>
              <span className="text-[#E8EAF0]">IND-MIN-01</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#4E5D7A]">
              <span>GRID LIMIT</span>
              <span className="text-[#E8EAF0]">LAT/LON BOUNDS</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
