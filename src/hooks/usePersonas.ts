import { useState, useCallback } from 'react';

interface Persona {
  id: string;
  name: string;
  role: string;
  pain_level: number;
  tech_savviness: number;
  age_range?: string;
  income_level?: string;
  goals?: string;
  frustrations?: string;
}

export function usePersonas(simulationId: string) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v2/simulations/${simulationId}/personas`);
      const data = await res.json();
      setPersonas(data.personas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [simulationId]);

  const createPersona = useCallback(async (persona: Omit<Persona, 'id'>) => {
    try {
      const res = await fetch(`/api/v2/simulations/${simulationId}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchPersonas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  }, [simulationId, fetchPersonas]);

  const updatePersona = useCallback(async (id: string, updates: Partial<Persona>) => {
    try {
      const res = await fetch(`/api/v2/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchPersonas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }, [fetchPersonas]);

  const deletePersona = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v2/personas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await fetchPersonas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }, [fetchPersonas]);

  const duplicatePersona = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v2/personas/${id}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      await fetchPersonas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate');
    }
  }, [fetchPersonas]);

  return {
    personas,
    loading,
    error,
    fetchPersonas,
    createPersona,
    updatePersona,
    deletePersona,
    duplicatePersona
  };
}
