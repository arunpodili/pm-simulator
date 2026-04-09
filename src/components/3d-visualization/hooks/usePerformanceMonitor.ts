/**
 * usePerformanceMonitor Hook
 *
 * Tracks FPS and automatically reduces rendering quality if performance drops.
 * Used by the 3D visualization canvas to maintain smooth frame rates.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';

export function usePerformanceMonitor() {
  const { gl } = useThree();
  const [fps, setFps] = useState(60);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCount = useRef(0);

  useEffect(() => {
    let animationId: number;

    const checkPerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();

      if (currentTime - lastTime.current >= 1000) {
        const currentFps = Math.round(
          (frameCount.current * 1000) / (currentTime - lastTime.current)
        );
        setFps(currentFps);
        frameCount.current = 0;
        lastTime.current = currentTime;

        // Auto-reduce quality if FPS drops
        if (currentFps < 30) {
          lowFpsCount.current++;

          if (lowFpsCount.current >= 3 && quality === 'high') {
            setQuality('medium');
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
          } else if (lowFpsCount.current >= 5 && quality === 'medium') {
            setQuality('low');
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 0.75));
          }
        } else {
          lowFpsCount.current = Math.max(0, lowFpsCount.current - 1);
        }
      }

      animationId = requestAnimationFrame(checkPerformance);
    };

    animationId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(animationId);
  }, [gl, quality]);

  return { fps, quality };
}
