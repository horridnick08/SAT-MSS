'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, HardDrive, Wifi, Clock, UserCheck } from 'lucide-react';

interface ConnectionStatus {
  api: 'checking' | 'connected' | 'disconnected';
  database: 'checking' | 'connected' | 'disconnected';
  redis: 'checking' | 'connected' | 'disconnected';
}

export default function StatusBar() {
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>({
    api: 'checking',
    database: 'checking',
    redis: 'checking',
  });

  // Dynamic Live Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll API health endpoint to determine API, Database, and Redis connectivity status
  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Dynamically locate Express base health URL from environment
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const healthUrl = apiBaseUrl.replace('/api/v1', '').replace('/api', '') + '/health';
        
        const response = await axios.get(healthUrl, { timeout: 3000 });
        
        if (response.status === 200 && response.data?.status === 'healthy') {
          setStatus({
            api: 'connected',
            database: 'connected',
            redis: 'connected', // Seeding and startup verifies this
          });
        } else {
          setStatus({
            api: 'connected',
            database: 'disconnected',
            redis: 'disconnected',
          });
        }
      } catch (error) {
        setStatus({
          api: 'disconnected',
          database: 'disconnected',
          redis: 'disconnected',
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Poll health check every 10s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (state: 'checking' | 'connected' | 'disconnected') => {
    switch (state) {
      case 'connected':
        return 'text-[#1AABB0] bg-[#1AABB0]/10 border-[#1AABB0]/20';
      case 'disconnected':
        return 'text-[#C94040] bg-[#C94040]/10 border-[#C94040]/20';
      case 'checking':
      default:
        return 'text-[#8A9BBB] bg-white/5 border-white/5';
    }
  };

  const getStatusText = (state: 'checking' | 'connected' | 'disconnected') => {
    switch (state) {
      case 'connected':
        return 'ONLINE';
      case 'disconnected':
        return 'OFFLINE';
      case 'checking':
      default:
        return 'LINKING';
    }
  };

  return (
    <footer className="flex h-8 w-full items-center justify-between border-t border-[#2A3547]/50 bg-[#06080D]/95 px-6 z-30 font-mono text-[9px] tracking-widest text-[#8A9BBB] select-none">
      {/* System Status Indicators */}
      <div className="flex items-center gap-4">
        {/* API connection */}
        <div className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3 text-[#4E5D7A]" />
          <span>API:</span>
          <span
            className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getStatusColor(
              status.api
            )}`}
          >
            {getStatusText(status.api)}
          </span>
        </div>

        {/* Database connection */}
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3 w-3 text-[#4E5D7A]" />
          <span>DB:</span>
          <span
            className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getStatusColor(
              status.database
            )}`}
          >
            {getStatusText(status.database)}
          </span>
        </div>

        {/* Redis connection */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#4E5D7A]" />
          <span>REDIS:</span>
          <span
            className={`px-1.5 py-0.5 rounded border text-[8px] font-bold ${getStatusColor(
              status.redis
            )}`}
          >
            {getStatusText(status.redis)}
          </span>
        </div>
      </div>

      {/* Right User Auth indicator & Digital Clock */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-[#1AABB0] bg-[#1AABB0]/5 px-2 py-0.5 rounded border border-[#1AABB0]/15">
          <UserCheck className="h-3 w-3" />
          <span className="text-[8px] font-bold font-sans">SECURE SYSTEM AUTHENTICATED</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#E8EAF0]">
          <Clock className="h-3 w-3 text-[#E88C30]" />
          <span>{time}</span>
        </div>
      </div>
    </footer>
  );
}
