# Frontend (Next.js 14)

**Location:** `src/`  
**Last Updated:** 2026-04-03

## Architecture Overview

Next.js 14 app with TypeScript, Tailwind CSS, and Framer Motion animations.

```
src/
├── app/                   # App Router
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout with AuthContext
│   ├── simulate/         # Simulation interface
│   ├── login/            # Authentication
│   ├── register/         # User registration
│   ├── dashboard/        # User dashboard
│   ├── demo/             # Demo page
│   └── templates/        # Template gallery
├── components/
│   ├── simulation/       # Simulation-specific
│   │   ├── BriefForm.tsx
│   │   ├── LLMSimulationResults.tsx
│   │   ├── LLMSimulationRunning.tsx
│   │   ├── SimulationSetup.tsx
│   │   └── AgentGraph.tsx
│   ├── ui/               # 22+ reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   └── ...
│   └── 3d/
│       └── Scene3D.tsx   # CSS-based 3D effects
├── lib/
│   ├── api/
│   │   ├── client.ts     # API client
│   │   └── types.ts      # TypeScript types
│   ├── context/
│   │   └── AuthContext.tsx
│   └── hooks/
│       └── useProtectedRoute.ts
└── styles/
    └── globals.css
```

## Key Components

### Simulation Flow

1. **BriefForm** (`app/simulate/page.tsx`) - User inputs product brief
2. **SimulationRunning** - Shows progress with mock mode toggle
3. **LLMSimulationResults** - Displays debate results, personas, network graph

### UI Library

22 reusable components in `components/ui/`:
- Form: Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch
- Feedback: Badge, Card, Progress, Skeleton, Toast
- Navigation: Dialog, DropdownMenu, Tabs
- Layout: Avatar, Separator, Label, Table

## API Integration

Base URL: `http://localhost:5001`

| Endpoint | Method | Component |
|----------|--------|-----------|
| `/api/simulation/health` | GET | Health check |
| `/api/simulation/llm/create` | POST | BriefForm |
| `/api/simulation/llm/{id}/run` | POST | SimulationRunning |
| `/api/simulation/{id}/llm/results` | GET | LLMSimulationResults |

## Styling

- **Tailwind CSS** with custom config
- **Design System**: Clean white/gray, minimal aesthetic
- **Animations**: Framer Motion for page transitions
- **3D Effects**: CSS-based (Three.js removed due to React 18 incompatibility)

## Authentication

- JWT-based auth via `AuthContext`
- Protected routes via `useProtectedRoute`
- Demo account: `demo@example.com` / `demo123`

## Running Locally

```bash
npm run dev        # Port 3000 (or next available)
npm run build      # Production build
npm run lint       # ESLint
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # For future Clerk integration
```

## Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.1",
  "framer-motion": "^12.38.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^1.7.0",
  "d3": "^7.9.0"
}
```

## Known Issues

- Three.js removed - use CSS-based animations instead
- Some pages require `continue-on-error` in CI

## Testing

```bash
npm run test       # Jest tests (not yet fully configured)
```
