"""
Optimized Simulation Hooks with Memoization

Provides performance-optimized hooks for simulation data.
"""

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

interface SimulationMetrics {
  totalUsers: number;
  conversionRate: number;
  churnRate: number;
  revenue: number;
}

interface DayData {
  day: number;
  newUsers: number;
  activeUsers: number;
  revenue: number;
  satisfaction: number;
}

/**
 * Hook for expensive simulation calculations with memoization
 */
export function useMemoizedSimulation(timeline: DayData[]) {
  // Memoize expensive calculations
  const metrics = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return {
        totalUsers: 0,
        conversionRate: 0,
        churnRate: 0,
        revenue: 0,
        avgSatisfaction: 0
      };
    }

    const totalNew = timeline.reduce((sum, day) => sum + day.newUsers, 0);
    const totalRevenue = timeline.reduce((sum, day) => sum + day.revenue, 0);
    const avgSatisfaction = timeline.reduce((sum, day) => sum + day.satisfaction, 0) / timeline.length;
    const lastDay = timeline[timeline.length - 1];

    return {
      totalUsers: totalNew,
      conversionRate: totalNew > 0 ? (lastDay.activeUsers / totalNew) * 100 : 0,
      churnRate: totalNew > 0 ? ((totalNew - lastDay.activeUsers) / totalNew) * 100 : 0,
      revenue: totalRevenue,
      avgSatisfaction
    };
  }, [timeline]);

  // Memoize chart data preparation
  const chartData = useMemo(() => {
    if (!timeline) return [];

    return timeline.map(day => ({
      day: day.day,
      users: day.activeUsers,
      revenue: day.revenue,
      satisfaction: day.satisfaction
    }));
  }, [timeline]);

  // Memoize summary statistics
  const summary = useMemo(() => {
    if (!timeline || timeline.length === 0) return null;

    const midPoint = Math.floor(timeline.length / 2);
    const firstHalf = timeline.slice(0, midPoint);
    const secondHalf = timeline.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.newUsers, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.newUsers, 0) / secondHalf.length;

    return {
      growthRate: firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0,
      peakDay: timeline.reduce((max, day) => day.newUsers > max.newUsers ? day : max, timeline[0]),
      trend: secondHalfAvg > firstHalfAvg ? 'up' : 'down'
    };
  }, [timeline]);

  return { metrics, chartData, summary };
}

/**
 * Hook for optimized API calls with caching
 */
export function useCachedAPI<T>(
  url: string,
  options?: RequestInit,
  cacheDuration: number = 60000 // 1 minute default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref for cache to persist across renders
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const fetchData = useCallback(async () => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = cacheRef.current.get(cacheKey);

    // Return cached data if fresh
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      // Cache the result
      cacheRef.current.set(cacheKey, { data: result, timestamp: Date.now() });

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url, options, cacheDuration]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    cacheRef.current.delete(cacheKey);
    fetchData();
  }, [fetchData, url, options]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    cacheRef.current.delete(cacheKey);
  }, [url, options]);

  return { data, loading, error, refresh, invalidate };
}

/**
 * Hook for debounced value (reduces API calls)
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled function execution
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000
): T {
  const lastRunRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      callbackRef.current(...args);
    }
  }, [delay]) as T;
}

/**
 * Hook for virtualized list (large data sets)
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const { virtualItems, totalHeight, startIndex, endIndex } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

    const virtualItems = items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0
      }
    }));

    return { virtualItems, totalHeight, startIndex, endIndex };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    onScroll,
    containerStyle: { position: 'relative' as const, height: containerHeight, overflow: 'auto' }
  };
}
