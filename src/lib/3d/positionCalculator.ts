import * as THREE from 'three';
import { Agent3D } from '@/types/agent3d';

// Calculate circular cluster position for an agent
export function calculateClusterPosition(
  index: number,
  total: number,
  state: Agent3D['state'],
  personaType: Agent3D['persona_type']
): { x: number; y: number; z: number } {
  const angle = (index / total) * Math.PI * 2;

  // Base radius by state (converted/advocate closer to center)
  const stateRadii: Record<Agent3D['state'], number> = {
    unaware: 250,
    aware: 200,
    signed_up: 120,
    active: 150,
    engaged: 100,
    churned: 80,
    converted: 60,
    advocate: 50,
  };

  const baseRadius = stateRadii[state] || 200;
  const radius = baseRadius + (Math.random() * 40 - 20);

  return {
    x: Math.cos(angle) * radius,
    y: (Math.random() - 0.5) * 30,
    z: Math.sin(angle) * radius,
  };
}

// Convert world position to screen coordinates
export function worldToScreen(
  position: { x: number; y: number; z: number },
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } | null {
  const vector = new THREE.Vector3(position.x, position.y, position.z);
  vector.project(camera);

  const x = (vector.x * 0.5 + 0.5) * canvasWidth;
  const y = (-(vector.y * 0.5) + 0.5) * canvasHeight;

  // Return null if behind camera
  if (vector.z > 1) return null;

  return { x, y };
}

// Get cluster center for a state (for camera focus)
export function getClusterCenter(state: Agent3D['state']): { x: number; y: number; z: number } {
  const centers: Record<Agent3D['state'], { x: number; y: number; z: number }> = {
    unaware: { x: 0, y: 0, z: 250 },
    aware: { x: 0, y: 0, z: 200 },
    signed_up: { x: 0, y: 20, z: 120 },
    active: { x: 0, y: 30, z: 150 },
    engaged: { x: 0, y: 40, z: 100 },
    churned: { x: 0, y: -20, z: 80 },
    converted: { x: 0, y: 50, z: 60 },
    advocate: { x: 0, y: 60, z: 50 },
  };

  return centers[state] || { x: 0, y: 0, z: 0 };
}
