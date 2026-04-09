/**
 * 3D Color System for Agent Visualization
 *
 * Defines color mappings for agent states used by the InstancedMesh renderer.
 * Colors are aligned with Tailwind CSS palette for consistency.
 */

import { AgentState } from '@/types/agent3d';
import * as THREE from 'three';

// Color hex values for each agent state
export const STATE_COLORS: Record<AgentState, number> = {
  unaware: 0x94A3B8,      // Gray (Slate-400)
  aware: 0x06b6d4,        // Cyan (Primary)
  signed_up: 0x10B981,     // Emerald
  active: 0x34D399,        // Light emerald
  engaged: 0xF59E0B,      // Amber/Gold
  churned: 0xF43F5E,        // Rose/Danger
  converted: 0x10B981,      // Same as signed_up
  advocate: 0xA855F7,       // Purple
};

/**
 * Get Three.js Color for an agent state
 * @param state - The agent state
 * @returns THREE.Color instance
 */
export const getColorForState = (state: AgentState): THREE.Color => {
  return new THREE.Color(STATE_COLORS[state] || STATE_COLORS.unaware);
};

/**
 * Get hex color string for an agent state (for UI elements)
 * @param state - The agent state
 * @returns Hex color string (e.g., '#10B981')
 */
export const getHexColorForState = (state: AgentState): string => {
  return '#' + STATE_COLORS[state].toString(16).padStart(6, '0');
};

// Legend items for UI
export const LEGEND_ITEMS = [
  { state: 'converted' as AgentState, label: 'Converted', color: '#10B981' },
  { state: 'engaged' as AgentState, label: 'Engaged', color: '#F59E0B' },
  { state: 'aware' as AgentState, label: 'Aware', color: '#06b6d4' },
  { state: 'unaware' as AgentState, label: 'Unaware', color: '#94A3B8' },
  { state: 'churned' as AgentState, label: 'Churned', color: '#F43F5E' },
  { state: 'advocate' as AgentState, label: 'Advocate', color: '#A855F7' },
];

/**
 * Get color for persona type (alternative color mode)
 * @param personaType - The persona type
 * @returns THREE.Color instance
 */
export const getColorForPersona = (personaType: string): THREE.Color => {
  const colors: Record<string, number> = {
    enthusiast: 0xF59E0B,  // Amber
    pragmatist: 0x3B82F6,  // Blue
    skeptic: 0xEF4444,     // Red
    laggard: 0x6B7280,     // Gray
  };
  return new THREE.Color(colors[personaType] || colors.laggard);
};

/**
 * Get color based on influence score (heatmap style)
 * @param influence - Score from 0.0 to 1.0
 * @returns THREE.Color instance
 */
export const getColorForInfluence = (influence: number): THREE.Color => {
  // Interpolate from blue (low) to red (high)
  const color = new THREE.Color();
  color.setHSL(0.6 - influence * 0.6, 1.0, 0.5);
  return color;
};
