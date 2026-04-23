'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileDown } from 'lucide-react';
import { ExportModal } from './ExportModal';

interface ExportButtonProps {
  simulation: any;
  personas: any[];
  structuredData?: any;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ExportButton({
  simulation,
  personas,
  structuredData,
  variant = 'secondary',
  size = 'md',
  className,
}: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export
      </Button>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={{ simulation, personas, structuredData }}
      />
    </>
  );
}
