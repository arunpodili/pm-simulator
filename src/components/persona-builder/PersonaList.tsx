'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import { PersonaForm } from './PersonaForm';

interface PersonaListProps {
  personas: any[];
  onCreate: (data: any) => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  maxPersonas?: number;
}

export function PersonaList({ personas, onCreate, onUpdate, onDelete, onDuplicate, maxPersonas = 5 }: PersonaListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<any>(null);

  const canAddMore = personas.length < maxPersonas;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Target Personas ({personas.length}/{maxPersonas})</h3>
        {canAddMore && (
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Persona
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onEdit={() => {
              setEditingPersona(persona);
              setIsFormOpen(true);
            }}
            onDelete={() => onDelete(persona.id)}
            onDuplicate={() => onDuplicate(persona.id)}
          />
        ))}

        {personas.length === 0 && (
          <div className="col-span-full rounded-lg border-2 border-dashed p-8 text-center text-gray-500">
            <p>No personas defined yet.</p>
            <p className="text-sm">Add up to {maxPersonas} target customer personas.</p>
          </div>
        )}
      </div>

      <PersonaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPersona(null);
        }}
        onSubmit={editingPersona
          ? (data) => onUpdate(editingPersona.id, data)
          : onCreate
        }
        initialData={editingPersona}
      />
    </div>
  );
}
