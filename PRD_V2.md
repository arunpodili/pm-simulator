# Product Requirements Document: PM Simulator v2.0

## Executive Summary

**Version:** 2.0
**Theme:** Rich Minimalist
**Goal:** Transform from functional prototype to premium, professional-grade product management tool

---

## Design Philosophy

### Aesthetic: "Rich Minimalist"
- **Color Palette:** Strict black & white with subtle gray gradients
- **Typography:** Typewriter-inspired monospace fonts for content, elegant serif for headings
- **Layout:** Wide, breathable workspace (1200px+ content width)
- **Principle:** "Every pixel should feel intentional"

### UX Principles Applied

| Principle | Application |
|-----------|-------------|
| **Jakob's Law** | Users spend most time on other products—follow familiar patterns (dropdowns, search bars) |
| **Fitts's Law** | Make interactive targets large and easily reachable (44px+ touch targets) |
| **Hick's Law** | Reduce cognitive load—progressive disclosure with collapsible sections |
| **Gestalt Proximity** | Group related fields visually with whitespace, not borders |
| **Von Restorff Effect** | Primary actions (Export, Save) stand out with high contrast |

---

## User Stories

### Navigation & Discovery

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | PM | Access a global search bar from any page | I can find features, templates, or case studies instantly |
| US-02 | PM | Navigate via dropdown menus | I don't have to hunt through pages to find what I need |
| US-03 | PM | See my current location in the app | I never feel lost |
| US-04 | New user | Discover available templates quickly | I understand the full capability of the tool |

### Template Editing Experience

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-05 | PM | Hide sections I don't need | My workspace feels clean and focused |
| US-06 | PM | See example text while I type | I have continuous guidance without switching contexts |
| US-07 | PM | Fill structured fields (What, Who, Why, Impact, When) | My thinking is organized and complete |
| US-08 | PM | Collapse/expand sections | I can focus on one area at a time |
| US-09 | PM | Know which sections are required vs optional | I don't waste time on non-essential content |
| US-10 | PM | See visual tables/diagrams in hints | I understand concepts faster |

### Content & Frameworks

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-11 | PM | Access pre-built framework templates | I don't start from scratch |
| US-12 | PM | Define multiple user personas | My product serves real user segments |
| US-13 | PM | Map document metadata easily | Version control is automatic |
| US-14 | PM | Track changes in a structured changelog | Stakeholders see evolution |
| US-15 | PM | Manage approvers visually | I know who needs to sign off |

### Export & Integration

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-16 | PM | Export to professionally formatted PDF | I can share with executives |
| US-17 | PM | Export to .docx | I can edit in Word before sharing |
| US-18 | PM | Add directly to Google Docs | My workflow is seamless |
| US-19 | PM | Push to Notion | My team documentation is centralized |
| US-20 | PM | Upload a doc to auto-fill fields | I can iterate on existing documents |

---

## UI/UX Improvements

### 1. Global Navigation System

**Current State:** Static horizontal menu
**Future State:** Dropdown-based navigation with search

```
┌────────────────────────────────────────────────────────────────┐
│  PM Simulator    [Search everything...]  🔔   👤   [▼]        │
│                    ─────────────────                          │
│                    Templates  │  Case Studies  │  Forum       │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Search bar: 400px width, always visible on desktop
- Dropdowns: Mega-menu style with icons
- Keyboard shortcut: `Cmd/Ctrl + K` for search

### 2. Collapsible Section System

**Current State:** All sections always visible
**Future State:** Per-section hide/show with memory

```
┌─────────────────────────────────────────────────────────────┐
│  ## Problem Statement                          [−] [👁] [⚙] │
│  ─────────────────────────────────────────────────────────  │
│  [Content area...]                                          │
└─────────────────────────────────────────────────────────────┘

[−] = Collapse/Expand
[👁] = Toggle visibility (hide from export)
[⚙] = Section settings (make required/optional)
```

### 3. Interactive Hint System

**Current State:** Static learn panel on right
**Future State:** Contextual, visual hints inline

**Structure for Complex Sections:**

```
┌─────────────────────────────────────────────────────────────┐
│  ## Problem Statement                          [−] [💡]     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ What is the problem?                                │   │
│  │ [Text input...]                                     │   │
│  │                                                     │   │
│  │ ─────────────────────────────────────────────────   │   │
│  │ 💡 Example: "Enterprise customers take 14 days to  │   │
│  │    activate, with 40% dropping off before setup."  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Who experiences this?                               │   │
│  │ [Text input...]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Why does this matter? (Impact)                      │   │
│  │ [Text input...]                                     │   │
│  │                                                     │   │
│  │ 💡 Include: $ impact, % impact, # of users affected │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ When does this occur?                               │   │
│  │ [Text input...]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4. Professional Export Redesign

**Current State:** Basic markdown dump
**Future State:** Professionally formatted documents

**PDF/Docx Structure:**
- Cover page with document title, author, date
- Table of contents with page numbers
- Header/footer with branding
- Proper typography hierarchy
- Page breaks between major sections
- Executive summary as first page

### 5. Typography System

| Element | Font | Size | Weight | Use Case |
|---------|------|------|--------|----------|
| H1 | Playfair Display | 32px | 700 | Page titles |
| H2 | Playfair Display | 24px | 600 | Section headers |
| H3 | Inter | 18px | 600 | Subsections |
| Body | IBM Plex Mono | 15px | 400 | All content |
| Caption | IBM Plex Mono | 13px | 400 | Hints, examples |
| Button | Inter | 14px | 500 | UI controls |

### 6. Spacing System

```
Base unit: 4px

xs:  4px   (tight spacing within components)
sm:  8px   (related elements)
md: 16px   (standard gap)
lg: 24px   (section padding)
xl: 32px   (major sections)
2xl: 48px  (page-level spacing)
3xl: 64px  (hero sections)
```

---

## Technical Requirements

### Frontend Components

| Component | Description | Priority |
|-----------|-------------|----------|
| `GlobalNav` | Mega-menu navigation with search | P0 |
| `SearchModal` | Cmd+K searchable modal | P0 |
| `CollapsibleSection` | Section with hide/show/memory | P0 |
| `StructuredField` | What/Who/Why/Impact/When inputs | P0 |
| `HintPanel` | Inline visual hints with examples | P0 |
| `PersonaBuilder` | Multi-persona form builder | P1 |
| `FrameworkLibrary` | Pre-built template snippets | P1 |
| `ExportMenu` | PDF, Docx, Google Docs, Notion | P0 |
| `ChangeLogManager` | Structured version tracking | P1 |
| `ApprovalWorkflow` | Approver management UI | P2 |

### Backend/Integration Requirements

| Feature | Description | Priority |
|---------|-------------|----------|
| PDF Generation | Server-side PDF rendering | P0 |
| Docx Generation | Microsoft Word format export | P0 |
| Google Docs API | Direct document creation | P1 |
| Notion API | Direct page creation | P1 |
| Document Parsing | Upload existing docs to auto-fill | P2 |
| User Preferences | Save section visibility settings | P1 |

### Export Format Specifications

**PDF:**
- Use `@react-pdf/renderer` for React-based PDF generation
- Include cover page, TOC, proper pagination
- Embed fonts (Playfair Display, IBM Plex Mono)
- Print-optimized (A4/Letter)

**Docx:**
- Use `docx` library for Node.js
- Preserve formatting, headings, tables
- Enable track changes on export

**Google Docs:**
- Use Google Docs API
- Create new document with formatted content
- Return shareable link

**Notion:**
- Use Notion API
- Create page in user's workspace
- Support database properties for metadata

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Time to complete PRD | ~45 min | ~30 min | Analytics tracking |
| Export usage rate | ~20% | ~60% | Export button clicks / completions |
| Section hide rate | N/A | ~40% | Sections hidden / total sections |
| Search usage | 0% | ~70% | Searches per session |
| User satisfaction | N/A | 4.5/5 | Post-completion survey |

---

## Out of Scope (v2.0)

- Real-time collaboration (multi-user editing)
- AI-powered content suggestions (v3.0)
- Mobile app (responsive web only)
- User authentication (local-only for now)
- Cloud sync (local storage only)

---

## Appendix: UX Justification

### Why Dropdowns Everywhere? (Jakob's Law)
Users are accustomed to dropdown navigation from tools like Linear, Notion, and Figma. Deviating from this pattern increases cognitive load. By adopting familiar patterns, we reduce learning time.

### Why Large Touch Targets? (Fitts's Law)
The time to acquire a target is a function of distance and size. Making interactive elements 44px+ (Apple HIG minimum) reduces error rates and improves perceived responsiveness.

### Why Progressive Disclosure? (Hick's Law)
The time it takes to make a decision increases with the number and complexity of choices. Collapsible sections reduce visible complexity, allowing users to focus on one task at a time.

### Why Structured Fields?
Cognitive load theory suggests that breaking complex tasks into smaller, structured chunks improves completion rates and quality. The What/Who/Why/Impact/When framework guides thinking systematically.

---

**Document Version:** 1.0
**Last Updated:** 2026-03-31
**Owner:** Product Team
