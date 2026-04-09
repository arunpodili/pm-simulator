'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  Sparkles,
  Zap,
  Heart,
  Brain,
  Briefcase,
  Target,
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Persona } from '@/lib/api/types';

const PRESET_PERSONAS: Persona[] = [
  {
    id: 'enthusiast-1',
    name: 'Early Adopter Emma',
    role: 'Tech Enthusiast',
    pain_level: 8,
    tech_savviness: 9,
    goals: 'Always first to try new products, influences peers',
    type: 'ENTHUSIAST',
    description: 'Early adopters who love trying new technology and influence their network',
  },
  {
    id: 'pragmatist-1',
    name: 'Pragmatic Paul',
    role: 'Operations Manager',
    pain_level: 7,
    tech_savviness: 6,
    goals: 'Needs proven ROI before adoption, values efficiency',
    type: 'PRAGMATIST',
    description: 'Results-driven professionals who need clear value propositions',
  },
  {
    id: 'skeptic-1',
    name: 'Skeptical Sarah',
    role: 'CFO',
    pain_level: 5,
    tech_savviness: 4,
    goals: 'Risk-averse, needs extensive proof and case studies',
    type: 'SKEPTIC',
    description: 'Cautious decision-makers who require substantial evidence',
  },
  {
    id: 'laggard-1',
    name: 'Traditional Tom',
    role: 'Senior Executive',
    pain_level: 3,
    tech_savviness: 2,
    goals: 'Prefers established methods, resistant to change',
    type: 'LAGGARD',
    description: 'Traditionalists who adopt only when necessary',
  },
  {
    id: 'influencer-1',
    name: 'Influencer Iris',
    role: 'Industry Analyst',
    pain_level: 6,
    tech_savviness: 8,
    goals: 'Creates content, shapes industry opinion',
    type: 'ENTHUSIAST',
    description: 'Thought leaders whose opinions carry weight in the industry',
  },
];

interface PersonaBuilderProps {
  onComplete: (personas: Persona[]) => void;
  onBack: () => void;
  initialPersonas?: Persona[];
}

export function PersonaBuilder({ onComplete, onBack, initialPersonas = [] }: PersonaBuilderProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>(initialPersonas);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const togglePersona = (persona: Persona) => {
    setSelectedPersonas((prev) => {
      const exists = prev.find((p) => p.id === persona.id);
      if (exists) {
        return prev.filter((p) => p.id !== persona.id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, persona];
    });
  };

  const handleCreatePersona = (persona: Persona) => {
    setSelectedPersonas((prev) => [...prev, persona]);
    setShowCreateForm(false);
  };

  const handleUpdatePersona = (updated: Persona) => {
    setSelectedPersonas((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingPersona(null);
  };

  const handleRemovePersona = (id: string) => {
    setSelectedPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  const getPersonaTypeIcon = (type: string) => {
    switch (type) {
      case 'ENTHUSIAST':
        return <Zap className="w-4 h-4" />;
      case 'PRAGMATIST':
        return <Briefcase className="w-4 h-4" />;
      case 'SKEPTIC':
        return <Brain className="w-4 h-4" />;
      case 'LAGGARD':
        return <Heart className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getPersonaTypeColor = (type: string) => {
    switch (type) {
      case 'ENTHUSIAST':
        return 'from-primary to-accent';
      case 'PRAGMATIST':
        return 'from-gold to-orange-500';
      case 'SKEPTIC':
        return 'from-purple-500 to-pink-500';
      case 'LAGGARD':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-primary to-accent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gradient mb-2 flex items-center justify-center gap-3">
          <Users className="w-6 h-6" />
          Define Your AI Personas
        </h2>
        <p className="text-gray-400">
          Select or create up to 5 AI personas that represent your target market segments
        </p>
      </div>

      {/* Selected Personas */}
      {selectedPersonas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-elevated rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Selected Personas ({selectedPersonas.length}/5)
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPersonas([])}
              className="text-danger"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedPersonas.map((persona) => (
              <motion.div
                key={persona.id}
                layout
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="glass rounded-xl px-4 py-3 flex items-center gap-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getPersonaTypeColor(
                    persona.type || 'ENTHUSIAST'
                  )} flex items-center justify-center`}
                >
                  {getPersonaTypeIcon(persona.type || 'ENTHUSIAST')}
                </div>
                <div>
                  <div className="font-medium text-sm">{persona.name}</div>
                  <div className="text-xs text-gray-400">{persona.role}</div>
                </div>
                <button
                  onClick={() => handleRemovePersona(persona.id)}
                  className="ml-2 p-1 rounded-lg hover:bg-danger/20 text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Preset Personas Grid */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Quick Select Presets
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_PERSONAS.map((persona) => {
            const isSelected = selectedPersonas.find((p) => p.id === persona.id);
            return (
              <motion.button
                key={persona.id}
                onClick={() => togglePersona(persona)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-5 rounded-xl text-left transition-all duration-300 ${
                  isSelected
                    ? 'glass-elevated border-2 border-primary shadow-glow'
                    : 'glass hover:border-border-hover'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getPersonaTypeColor(
                      persona.type || 'ENTHUSIAST'
                    )} flex items-center justify-center flex-shrink-0`}
                  >
                    {getPersonaTypeIcon(persona.type || 'ENTHUSIAST')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{persona.name}</h4>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{persona.role}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {persona.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-danger" />
                        <span className="text-xs">Pain: {persona.pain_level}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-primary" />
                        <span className="text-xs">Tech: {persona.tech_savviness}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Create Custom Persona */}
      <div className="glass rounded-2xl p-6 text-center">
        <h3 className="font-semibold mb-2">Create Custom Persona</h3>
        <p className="text-sm text-gray-400 mb-4">
          Define a unique persona specific to your product
        </p>
        <Button onClick={() => setShowCreateForm(true)} className="btn-gold">
          <Plus className="w-4 h-4 mr-2" />
          Create Persona
        </Button>
      </div>

      {/* Validation */}
      {selectedPersonas.length === 0 && (
        <div className="flex items-center gap-2 justify-center text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Select at least one persona to continue</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Templates
        </Button>
        <Button
          onClick={() => onComplete(selectedPersonas)}
          disabled={selectedPersonas.length === 0}
          className="btn-gold flex items-center gap-2"
        >
          Continue to Simulation
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
