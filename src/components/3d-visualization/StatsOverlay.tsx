'use client';

import { Agent3D } from '@/types/agent3d';

interface StatsOverlayProps {
  agents: Agent3D[];
}

export function StatsOverlay({ agents }: StatsOverlayProps) {
  const stats = {
    total: agents.length,
    converted: agents.filter(a => a.state === 'converted').length,
    churned: agents.filter(a => a.state === 'churned').length,
    engaged: agents.filter(a => a.state === 'engaged').length,
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
      <div className="glass rounded-lg px-4 py-2">
        <div className="text-xs text-gray-400">Total Agents</div>
        <div className="text-2xl font-bold text-accent">{stats.total.toLocaleString()}</div>
      </div>

      <div className="glass rounded-lg px-4 py-2 flex gap-6">
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-accent mx-auto mb-1" />
          <div className="text-xs text-gray-400">Converted</div>
          <div className="text-sm font-bold">{stats.converted}</div>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-gold mx-auto mb-1" />
          <div className="text-xs text-gray-400">Engaged</div>
          <div className="text-sm font-bold">{stats.engaged}</div>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-danger mx-auto mb-1" />
          <div className="text-xs text-gray-400">Churned</div>
          <div className="text-sm font-bold">{stats.churned}</div>
        </div>
      </div>
    </div>
  );
}
