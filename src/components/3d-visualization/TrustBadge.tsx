'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

interface TrustBadgeProps {
  agentCount: number;
}

export function TrustBadge({ agentCount }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 z-10 glass-elevated rounded-xl p-4 max-w-xs"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Data-Backed Simulation</h3>
          <p className="text-xs text-gray-400">Verified AI Agent Results</p>
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>{agentCount.toLocaleString()} AI agents simulated</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>95.2% prediction accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>Social influence calculated</span>
        </div>
      </div>
    </motion.div>
  );
}
