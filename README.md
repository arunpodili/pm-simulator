# PM Simulator - Product Management Training Platform

A comprehensive platform for product managers to practice real-world scenarios with industry-specific templates, embedded learning guides, and community case studies.

## 🎯 What This Is

PM Simulator helps product managers:
- **Practice real PM scenarios** with guided templates
- **Learn while working** with embedded mini-guides from 30+ years of PM expertise
- **Get industry-specific guidance** for SaaS, FinTech, Health, E-commerce, and AI/ML
- **Share and learn** through community case studies and Q&A forum

## ✨ Key Features

### 1. Industry-Specific Templates
Each industry has unique constraints, regulations, and best practices:
- **SaaS**: MRR, LTV:CAC, NRR, SOC2, enterprise sales cycles
- **FinTech**: PCI-DSS, fraud rates, banking partnerships, compliance
- **Health**: HIPAA, FDA, patient outcomes, EHR integrations
- **E-commerce**: Conversion rates, AOV, inventory, returns
- **AI/ML**: Model accuracy, latency, drift, ethical considerations

### 2. Comprehensive PRD Template (USP)
The most detailed PRD template available with **every single section** a PM could need:
- Document metadata & versioning
- Executive summary & TL;DR
- Problem statement with evidence
- User personas (primary, secondary, excluded)
- Jobs To Be Done framework
- Success metrics (leading, lagging, guardrails)
- Solution overview
- User stories with acceptance criteria
- Functional requirements (MoSCoW prioritized)
- Non-functional requirements (performance, security, accessibility)
- Data requirements & event tracking
- Integrations & dependencies
- API specifications
- UX/UI requirements
- Edge cases & error handling
- Rollout plan with feature flags
- GTM alignment
- Risk assessment
- Timeline & resourcing
- Post-launch plan
- Appendices

### 3. Embedded Learning ("Learn" Panels)
Every template section has a 💡 button that opens expert guidance:
- **How-to guides**: Step-by-step instructions
- **Best practices**: Lessons from experienced PMs
- **Concepts**: Framework explanations (JTBD, RICE, OKRs, etc.)
- **Checklists**: Don't miss critical items
- **Pitfalls**: Common mistakes to avoid

Content based on PM literature:
- "Inspired" by Marty Cagan
- "The Lean Startup" by Eric Ries
- "The Mom Test" by Rob Fitzpatrick
- "Measure What Matters" by John Doerr
- "Escaping the Build Trap" by Melissa Perri

### 4. Community Features
- **Case Study Library**: Browse detailed real-world PM projects
- **Q&A Forum**: Ask questions, get answers from experienced PMs
- **Share your work**: Publish anonymized case studies after completing simulations

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Export**: Markdown, Google Docs (via clipboard)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
cd pm-simulator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Usage

1. **Start a Simulation**: Go to `/simulator`
2. **Select Industry**: Choose from 5 industries
3. **Pick Scenario**: Feature Launch, Product Strategy, etc.
4. **Select Frameworks**: RICE, JTBD, OKRs, etc.
5. **Complete Template**: Work through comprehensive sections
6. **Use Learn Panels**: Click 💡 on any section for guidance
7. **Export**: Download as Markdown or copy to Google Docs

## 📁 Project Structure

```
pm-simulator/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   ├── simulator/
│   │   │   └── page.tsx          # Main simulator
│   │   ├── case-studies/
│   │   │   └── page.tsx          # Case study library
│   │   └── forum/
│   │       └── page.tsx          # Q&A forum
│   ├── components/
│   │   └── TemplateWorkspace.tsx # Main template UI
│   ├── data/
│   │   ├── industries.ts         # Industry definitions
│   │   ├── scenarios.ts          # Scenario definitions
│   │   ├── frameworks.ts         # Framework definitions
│   │   └── templates/
│   │       └── prd-feature-launch.ts
│   ├── content/
│   │   └── learn/
│   │       └── index.ts          # Learn mini-guides
│   ├── lib/
│   │   └── documentGenerator.ts  # Export utilities
│   └── types/
│       └── index.ts              # TypeScript types
└── package.json
```

## 📋 Available Templates

| Template | Scenario | Industries | Frameworks |
|----------|----------|------------|------------|
| Feature Launch PRD | feature-launch | All | RICE, JTBD, OKRs |

More templates coming soon:
- Product Strategy One-Pager
- User Research Plan
- Go-to-Market Plan
- Roadmap Planning Doc
- Pricing Change Analysis

## 🎓 Learn Content Categories

| Category | Description |
|----------|-------------|
| How-To | Step-by-step instructions |
| Best Practice | Lessons from experience |
| Concept | Framework explanations |
| Checklist | Items not to miss |
| Pitfall | Common mistakes |
| Example | Real-world illustrations |

## 🤝 Contributing

This is a free community tool. Contributions welcome!

## 📝 License

MIT - Free for educational and commercial use

## 🙏 Acknowledgments

Content inspired by:
- Marty Cagan - "Inspired", "Empowered"
- Eric Ries - "The Lean Startup"
- Rob Fitzpatrick - "The Mom Test"
- John Doerr - "Measure What Matters"
- Melissa Perri - "Escaping the Build Trap"
- Clayton Christensen - "Competing Against Luck"

---

**Built for product managers, by product managers.**

Free forever for the community.
