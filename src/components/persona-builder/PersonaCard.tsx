'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Copy } from 'lucide-react';

interface PersonaCardProps {
  persona: {
    id: string;
    name: string;
    role: string;
    pain_level: number;
    tech_savviness: number;
  };
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function PersonaCard({ persona, onEdit, onDelete, onDuplicate }: PersonaCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{persona.name}</h4>
            <p className="text-sm text-gray-500">{persona.role}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="secondary">Pain: {persona.pain_level}/10</Badge>
          <Badge variant="secondary">Tech: {persona.tech_savviness}/10</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
