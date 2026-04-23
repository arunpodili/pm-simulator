import { useState, useEffect, useCallback, useRef } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult {
  virtualItems: Array<{ index: number; style: React.CSSProperties }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useVirtualization(
  itemCount: number,
  options: VirtualizationOptions
): VirtualizationResult {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = itemCount * itemHeight;

  // Calculate visible range with overscan
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Generate virtual items
  const virtualItems = Array.from(
    { length: endIndex - startIndex },
    (_, i) => {
      const index = startIndex + i;
      return {
        index,
        style: {
          position: 'absolute' as const,
          top: index * itemHeight,
          height: itemHeight,
          left: 0,
          right: 0,
        },
      };
    }
  );

  // Scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = index * itemHeight;
      }
    },
    [itemHeight]
  );

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    containerRef,
  };
}

// Optimized list component
interface VirtualListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export function VirtualList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className,
}: VirtualListProps) {
  const { virtualItems, totalHeight, containerRef } = useVirtualization(
    items.length,
    { itemHeight, containerHeight }
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map(({ index, style }) => (
          <div key={index} style={style}>
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}
