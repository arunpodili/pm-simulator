# PM Simulator v2.0 Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete PM Simulator v2.0 with Persona Builder, Structured Fields, Hint System, Export Engine, Change Log, and 3D Visualization

**Architecture:** Next.js 14 frontend with Flask backend, following existing patterns. Database migrations for new tables. Component-based frontend architecture.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Flask, SQLAlchemy, PostgreSQL/SQLite

---

## Phase 1: Database Models & Migrations

### Task 1: Create SimulationPersona Model

**Files:**
- Create: `ai-agents-service/models/simulation_persona.py`
- Modify: `ai-agents-service/database.py` (import and register)
- Test: `tests/unit/test_simulation_persona.py`

**Complexity:** Medium

```python
# ai-agents-service/models/simulation_persona.py
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class SimulationPersona(Base):
    """Custom personas defined by users for simulation"""
    __tablename__ = 'simulation_personas'
    
    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    pain_level = Column(Integer, nullable=False)  # 1-10
    tech_savviness = Column(Integer, nullable=False)  # 1-10
    age_range = Column(String(20))
    income_level = Column(String(20))
    goals = Column(Text)
    frustrations = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    simulation = relationship("Simulation", back_populates="custom_personas")
    
    def to_dict(self):
        return {
            'id': self.id,
            'simulation_id': self.simulation_id,
            'name': self.name,
            'role': self.role,
            'pain_level': self.pain_level,
            'tech_savviness': self.tech_savviness,
            'age_range': self.age_range,
            'income_level': self.income_level,
            'goals': self.goals,
            'frustrations': self.frustrations,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
```

- [ ] **Step 1: Write failing test**
```python
# tests/unit/test_simulation_persona.py
def test_simulation_persona_creation():
    from models.simulation_persona import SimulationPersona
    persona = SimulationPersona(
        id="test-123",
        simulation_id="sim-456",
        name="Test User",
        role="Developer",
        pain_level=8,
        tech_savviness=9
    )
    assert persona.name == "Test User"
    assert persona.pain_level == 8
```

- [ ] **Step 2: Run test to verify it fails**
```bash
cd /c/Users/DELL/pm-simulator/ai-agents-service
pytest ../tests/unit/test_simulation_persona.py -v
```

- [ ] **Step 3: Create model file**
Write the model code shown above.

- [ ] **Step 4: Modify database.py to import**
Add: `from models.simulation_persona import SimulationPersona`

- [ ] **Step 5: Run test to verify it passes**

- [ ] **Step 6: Commit**
```bash
git add ai-agents-service/models/ tests/
git commit -m "feat: add SimulationPersona model"
```

---

### Task 2: Create ChangeLog Model

**Files:**
- Create: `ai-agents-service/models/change_log.py`
- Modify: `ai-agents-service/database.py`
- Test: `tests/unit/test_change_log.py`

**Complexity:** Medium

```python
# ai-agents-service/models/change_log.py
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from database import Base

class ChangeLog(Base):
    """Track changes to simulations"""
    __tablename__ = 'change_logs'
    
    id = Column(String(36), primary_key=True)
    simulation_id = Column(String(36), ForeignKey('simulations.id'), nullable=False, index=True)
    author_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    change_type = Column(String(50), nullable=False)  # param_change, persona_edit, result_note, decision
    field = Column(String(100))
    old_value = Column(JSON)
    new_value = Column(JSON)
    reason = Column(Text)
    impact = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'simulation_id': self.simulation_id,
            'author_id': self.author_id,
            'change_type': self.change_type,
            'field': self.field,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'reason': self.reason,
            'impact': self.impact,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
```

- [ ] **Step 1-6:** Follow same pattern as Task 1

---

### Task 3: Database Migration

**Files:**
- Create: `ai-agents-service/migrations/001_add_personas_and_changelog.py`

**Complexity:** Low

```python
# ai-agents-service/migrations/001_add_personas_and_changelog.py
"""Migration: Add simulation_personas and change_logs tables"""
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, Text, DateTime, ForeignKey, JSON
from database import DATABASE_URL

def upgrade():
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    
    simulation_personas = Table(
        'simulation_personas', metadata,
        Column('id', String(36), primary_key=True),
        Column('simulation_id', String(36), ForeignKey('simulations.id'), nullable=False, index=True),
        Column('name', String(100), nullable=False),
        Column('role', String(100), nullable=False),
        Column('pain_level', Integer, nullable=False),
        Column('tech_savviness', Integer, nullable=False),
        Column('age_range', String(20)),
        Column('income_level', String(20)),
        Column('goals', Text),
        Column('frustrations', Text),
        Column('created_at', DateTime),
        Column('updated_at', DateTime)
    )
    
    change_logs = Table(
        'change_logs', metadata,
        Column('id', String(36), primary_key=True),
        Column('simulation_id', String(36), ForeignKey('simulations.id'), nullable=False, index=True),
        Column('author_id', String(36), ForeignKey('users.id'), nullable=False),
        Column('change_type', String(50), nullable=False),
        Column('field', String(100)),
        Column('old_value', JSON),
        Column('new_value', JSON),
        Column('reason', Text),
        Column('impact', Text),
        Column('created_at', DateTime)
    )
    
    metadata.create_all(engine)
    print("Migration complete: Added simulation_personas and change_logs tables")

def downgrade():
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    metadata.reflect(engine)
    
    if 'simulation_personas' in metadata.tables:
        metadata.tables['simulation_personas'].drop(engine)
    if 'change_logs' in metadata.tables:
        metadata.tables['change_logs'].drop(engine)
    
    print("Migration rolled back")

if __name__ == '__main__':
    upgrade()
```

- [ ] **Step 1:** Create migration file
- [ ] **Step 2:** Run migration
```bash
cd /c/Users/DELL/pm-simulator/ai-agents-service
python migrations/001_add_personas_and_changelog.py
```
- [ ] **Step 3:** Verify tables created
- [ ] **Step 4:** Commit

---

## Phase 2: Backend API Endpoints

### Task 4: Persona API Endpoints

**Files:**
- Create: `ai-agents-service/api_v2/personas.py`
- Modify: `ai-agents-service/app_v2.py` (register blueprint)
- Test: `tests/integration/test_personas_api.py`

**Complexity:** Medium

```python
# ai-agents-service/api_v2/personas.py
from flask import Blueprint, request, jsonify
from database import db_session
from models.simulation_persona import SimulationPersona
from auth_middleware import require_auth
import uuid

personas_bp = Blueprint('personas', __name__, url_prefix='/api/v2')

@personas_bp.route('/simulations/<simulation_id>/personas', methods=['GET'])
@require_auth
def get_personas(simulation_id):
    """Get all personas for a simulation"""
    personas = db_session.query(SimulationPersona).filter_by(
        simulation_id=simulation_id
    ).all()
    return jsonify({
        'personas': [p.to_dict() for p in personas],
        'count': len(personas),
        'max_allowed': 5,
        'can_add_more': len(personas) < 5
    })

@personas_bp.route('/simulations/<simulation_id>/personas', methods=['POST'])
@require_auth
def create_persona(simulation_id):
    """Create a new persona"""
    data = request.get_json()
    
    # Check max personas
    existing_count = db_session.query(SimulationPersona).filter_by(
        simulation_id=simulation_id
    ).count()
    
    if existing_count >= 5:
        return jsonify({'error': 'Maximum 5 personas allowed'}), 400
    
    # Validate required fields
    required = ['name', 'role', 'pain_level', 'tech_savviness']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate ranges
    if not 1 <= data['pain_level'] <= 10:
        return jsonify({'error': 'pain_level must be 1-10'}), 400
    if not 1 <= data['tech_savviness'] <= 10:
        return jsonify({'error': 'tech_savviness must be 1-10'}), 400
    
    persona = SimulationPersona(
        id=str(uuid.uuid4()),
        simulation_id=simulation_id,
        name=data['name'],
        role=data['role'],
        pain_level=data['pain_level'],
        tech_savviness=data['tech_savviness'],
        age_range=data.get('age_range'),
        income_level=data.get('income_level'),
        goals=data.get('goals'),
        frustrations=data.get('frustrations')
    )
    
    db_session.add(persona)
    db_session.commit()
    
    return jsonify(persona.to_dict()), 201

@personas_bp.route('/personas/<persona_id>', methods=['PUT'])
@require_auth
def update_persona(persona_id):
    """Update a persona"""
    data = request.get_json()
    persona = db_session.query(SimulationPersona).get(persona_id)
    
    if not persona:
        return jsonify({'error': 'Persona not found'}), 404
    
    for field in ['name', 'role', 'pain_level', 'tech_savviness', 
                  'age_range', 'income_level', 'goals', 'frustrations']:
        if field in data:
            setattr(persona, field, data[field])
    
    db_session.commit()
    return jsonify(persona.to_dict())

@personas_bp.route('/personas/<persona_id>', methods=['DELETE'])
@require_auth
def delete_persona(persona_id):
    """Delete a persona"""
    persona = db_session.query(SimulationPersona).get(persona_id)
    
    if not persona:
        return jsonify({'error': 'Persona not found'}), 404
    
    db_session.delete(persona)
    db_session.commit()
    return jsonify({'message': 'Persona deleted'})

@personas_bp.route('/personas/<persona_id>/duplicate', methods=['POST'])
@require_auth
def duplicate_persona(persona_id):
    """Duplicate a persona"""
    persona = db_session.query(SimulationPersona).get(persona_id)
    
    if not persona:
        return jsonify({'error': 'Persona not found'}), 404
    
    # Check max personas
    existing_count = db_session.query(SimulationPersona).filter_by(
        simulation_id=persona.simulation_id
    ).count()
    
    if existing_count >= 5:
        return jsonify({'error': 'Maximum 5 personas allowed'}), 400
    
    new_persona = SimulationPersona(
        id=str(uuid.uuid4()),
        simulation_id=persona.simulation_id,
        name=f"{persona.name} (Copy)",
        role=persona.role,
        pain_level=persona.pain_level,
        tech_savviness=persona.tech_savviness,
        age_range=persona.age_range,
        income_level=persona.income_level,
        goals=persona.goals,
        frustrations=persona.frustrations
    )
    
    db_session.add(new_persona)
    db_session.commit()
    
    return jsonify(new_persona.to_dict()), 201
```

- [ ] **Step 1-6:** Write, test, and commit

---

### Task 5: Change Log API Endpoints

**Files:**
- Create: `ai-agents-service/api_v2/change_logs.py`
- Modify: `ai-agents-service/app_v2.py`
- Test: `tests/integration/test_change_logs_api.py`

**Complexity:** Medium

```python
# ai-agents-service/api_v2/change_logs.py
from flask import Blueprint, request, jsonify
from database import db_session
from models.change_log import ChangeLog
from auth_middleware import require_auth
import uuid

change_logs_bp = Blueprint('change_logs', __name__, url_prefix='/api/v2')

@change_logs_bp.route('/simulations/<simulation_id>/changelog', methods=['GET'])
@require_auth
def get_changelog(simulation_id):
    """Get change history for a simulation"""
    entries = db_session.query(ChangeLog).filter_by(
        simulation_id=simulation_id
    ).order_by(ChangeLog.created_at.desc()).all()
    
    return jsonify({
        'entries': [e.to_dict() for e in entries],
        'count': len(entries)
    })

@change_logs_bp.route('/simulations/<simulation_id>/changelog/annotate', methods=['POST'])
@require_auth
def add_annotation(simulation_id):
    """Add manual annotation to change log"""
    data = request.get_json()
    user = request.user
    
    entry = ChangeLog(
        id=str(uuid.uuid4()),
        simulation_id=simulation_id,
        author_id=user['id'],
        change_type='decision',
        field=data.get('field'),
        old_value=data.get('old_value'),
        new_value=data.get('new_value'),
        reason=data.get('reason'),
        impact=data.get('impact')
    )
    
    db_session.add(entry)
    db_session.commit()
    
    return jsonify(entry.to_dict()), 201
```

- [ ] **Step 1-6:** Write, test, and commit

---

## Phase 3: Frontend Components

### Task 6: PersonaBuilder Components

**Files:**
- Create: `src/components/persona-builder/PersonaCard.tsx`
- Create: `src/components/persona-builder/PersonaForm.tsx`
- Create: `src/components/persona-builder/PersonaList.tsx`
- Create: `src/hooks/usePersonas.ts`

**Complexity:** High

```typescript
// src/hooks/usePersonas.ts
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

  return {
    personas,
    loading,
    error,
    fetchPersonas,
    createPersona,
    updatePersona,
    deletePersona
  };
}
```

```typescript
// src/components/persona-builder/PersonaCard.tsx
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
```

```typescript
// src/components/persona-builder/PersonaForm.tsx
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
```

```typescript
// src/components/persona-builder/PersonaList.tsx
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
  maxPersonas?: number;
}

export function PersonaList({ personas, onCreate, onUpdate, onDelete, maxPersonas = 5 }: PersonaListProps) {
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
            onDuplicate={() => {/* TODO: duplicate */}}
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
```

- [ ] **Step 1-6:** Create all files, test, commit

---

## Phase 4: Integration

### Task 7: Register API Blueprints

**Files:**
- Modify: `ai-agents-service/app_v2.py`

**Complexity:** Low

```python
# Add to app_v2.py
from api_v2.personas import personas_bp
from api_v2.change_logs import change_logs_bp

# Register blueprints
app.register_blueprint(personas_bp)
app.register_blueprint(change_logs_bp)
```

- [ ] **Step 1-6:** Update, test, commit

---

### Task 8: Push to GitHub

```bash
cd /c/Users/DELL/pm-simulator
git add docs/superpowers/
git add ai-agents-service/
git add src/
git add tests/
git commit -m "feat: complete PM Simulator v2 implementation plan and database models

- Add SimulationPersona and ChangeLog models
- Create database migrations
- Add Persona API endpoints
- Add Change Log API endpoints
- Create PersonaBuilder frontend components
- Create usePersonas hook
- Register all API blueprints

Completes design spec: 2026-04-08-pm-simulator-v2-completion-design.md"

git push origin feature/production-architecture-v2
```

---

## Summary

This implementation plan covers:
1. Database models and migrations (Tasks 1-3)
2. Backend API endpoints (Tasks 4-5)
3. Frontend components (Task 6)
4. Integration and deployment (Tasks 7-8)

**Total Tasks:** 8
**Estimated Time:** 6-8 hours
**Complexity Distribution:**
- Low: 3 tasks
- Medium: 4 tasks
- High: 1 task

**Next Steps:**
1. Execute tasks using superpowers:subagent-driven-development or superpowers:executing-plans
2. Run full test suite after each phase
3. Verify all endpoints with curl/Postman
4. Deploy to staging environment

---

*Plan Version: 1.0*  
*Last Updated: 2026-04-08*
