'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  TrendingUp,
  MessageSquare,
  Target,
  Clock,
  Zap,
  Brain,
  Cpu,
} from 'lucide-react';
import { simulationsApi } from '@/lib/api/client';

interface SimulationRunningProps {
  simulationId: string;
  onComplete: (results: any) => void;
}

interface StreamingEvent {
  type: 'progress' | 'insight' | 'agent_activity' | 'complete' | 'error';
  data: any;
}

export function SimulationRunning({ simulationId, onComplete }: SimulationRunningProps) {
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [agentCount, setAgentCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing');

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    let stream: { close: () => void } | null = null;

    const runSimulation = async () => {
      try {
        stream = await simulationsApi.stream(simulationId, (event: StreamingEvent) => {
          switch (event.type) {
            case 'progress':
              const progressData = event.data as { progress: number; phase?: string };
              setProgress(progressData.progress);
              if (progressData.phase) {
                setCurrentPhase(progressData.phase);
              }
              break;
            case 'agent_activity':
              setAgentCount((prev) => prev + (event.data.count || 1));
              break;
            case 'insight':
              setInsights((prev) => [event.data, ...prev].slice(0, 5));
              break;
            case 'complete':
              onComplete(event.data);
              break;
            case 'error':
              console.error('Simulation error:', event.data);
              break;
          }
        });
      } catch (error) {
        console.error('Failed to start streaming:', error);
      }
    };

    runSimulation();

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.close();
      }
    };
  }, [simulationId, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'initializing':
        return <Cpu className="w-5 h-5" />;
      case 'generating personas':
        return <Users className="w-5 h-5" />;
      case 'simulating':
      case 'running simulation':
        return <Activity className="w-5 h-5" />;
      case 'analyzing':
        return <Brain className="w-5 h-5" />;
      case 'generating insights':
        return <Zap className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Main Animation */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          style={{ width: 200, height: 200 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/30"
          style={{ width: 200, height: 200 }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateX(95px) translateY(-50%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Inner core */}
        <motion.div
          className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent opacity-80"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <svg className="absolute inset-0 w-[200px] h-[200px] -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="hsl(var(--surface-muted))"
            strokeWidth="4"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * (1 - progress / 100)}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Progress Info */}
      <div className="text-center mb-8">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          {getPhaseIcon(currentPhase)}
          <span className="text-lg font-semibold">{currentPhase}</span>
        </motion.div>
        <div className="text-4xl font-bold text-gradient mb-1">{progress}%</div>
        <div className="text-sm text-gray-400">
          Simulating {agentCount.toLocaleString()} AI agents
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="glass rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
          <div className="text-xs text-gray-400">Elapsed</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Users className="w-5 h-5 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">10K</div>
          <div className="text-xs text-gray-400">Agents</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Brain className="w-5 h-5 text-gold mx-auto mb-2" />
          <div className="text-2xl font-bold">{insights.length}</div>
          <div className="text-xs text-gray-400">Insights</div>
        </div>
      </div>

      {/* Live Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-lg"
        >
          <div className="glass-elevated rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Live Insights
            </h4>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg glass-muted"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      insight.type === 'positive'
                        ? 'bg-accent'
                        : insight.type === 'warning'
                        ? 'bg-gold'
                        : 'bg-primary'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{insight.title}</div>
                    <div className="text-xs text-gray-400">{insight.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
