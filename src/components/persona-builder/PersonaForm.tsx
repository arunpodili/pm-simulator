'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Textarea } from '@/components/ui/Textarea';

interface PersonaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function PersonaForm({ isOpen, onClose, onSubmit, initialData }: PersonaFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    role: '',
    pain_level: 5,
    tech_savviness: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Persona' : 'Add Persona'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Startup Sarah"
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Founder"
              required
            />
          </div>
          <div>
            <Label>Pain Level: {formData.pain_level}</Label>
            <Slider
              value={[formData.pain_level]}
              onValueChange={([v]) => setFormData({ ...formData, pain_level: v })}
              min={1}
              max={10}
              step={1}
            />
          </div>
          <div>
            <Label>Tech Savviness: {formData.tech_savviness}</Label>
            <Slider
              value={[formData.tech_savviness]}
              onValueChange={([v]) => setFormData({ ...formData, tech_savviness: v })}
              min={1}
              max={10}
              step={1}
            />
          </div>
          <div>
            <Label htmlFor="goals">Goals (optional)</Label>
            <Textarea
              id="goals"
              value={formData.goals || ''}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="What does this persona want to achieve?"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Persona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
