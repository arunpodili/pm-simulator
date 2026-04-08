'use client';

import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface TimelineScrubberProps {
  currentDay: number;
  totalDays: number;
  onChange?: (day: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export function TimelineScrubber({
  currentDay,
  totalDays,
  onChange,
  isPlaying = false,
  onPlayToggle,
}: TimelineScrubberProps) {
  const progress = (currentDay / totalDays) * 100;

  const handleSliderChange = (value: number[]) => {
    if (onChange) {
      onChange(Math.round((value[0] / 100) * totalDays));
    }
  };

  const handlePrevious = () => {
    if (onChange && currentDay > 0) {
      onChange(currentDay - 1);
    }
  };

  const handleNext = () => {
    if (onChange && currentDay < totalDays) {
      onChange(currentDay + 1);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] max-w-[600px] bg-gray-800/90 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={handlePrevious}
            disabled={currentDay <= 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={onPlayToggle}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={handleNext}
            disabled={currentDay >= totalDays}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Timeline */}
        <div className="flex-1">
          <Slider
            value={[progress]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Day counter */}
        <div className="text-sm text-gray-300 whitespace-nowrap">
          Day {currentDay} / {totalDays}
        </div>
      </div>
    </div>
  );
}
