# PM Simulator Documentation

Welcome to the PM Simulator documentation. This directory contains comprehensive guides, API references, and architectural documentation.

## Quick Start

- **[Getting Started](guides/getting-started.md)** - First time? Start here for a 5-minute tutorial
- **[Quick Reference](guides/quick-reference.md)** - Common commands, API endpoints, and patterns
- **[Best Practices](guides/best-practices.md)** - How to write great briefs and interpret results

## Developer Documentation

### Architecture
- **[System Overview](architecture/system-overview.md)** - High-level architecture diagrams and data flow
- **[Architecture.md](developer/architecture.md)** - Detailed architecture for developers

### Development
- **[Contributing Guide](developer/contributing.md)** - How to contribute, coding standards, PR process
- **[Deployment Guide](developer/deployment-guide.md)** - Production deployment step-by-step
- **[Quick Reference](guides/quick-reference.md)** - Commands and patterns

## API Reference

- **[OpenAPI Specification](api/openapi.yml)** - Complete API specification (OpenAPI 3.0)
  - View in [Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/arunpodili/pm-simulator/main/docs/api/openapi.yml)

## Feature Documentation

### Core Features (v2.0)

| Feature | Description | Documentation |
|---------|-------------|---------------|
| **Persona Builder** | Create up to 5 custom user personas | [Getting Started](guides/getting-started.md#build-your-personas) |
| **Structured Fields** | What/Who/Why/Impact/When framework | [Best Practices](guides/best-practices.md#framework-application) |
| **Hint System** | Contextual guidance from PM classics | [Getting Started](guides/getting-started.md#refine-your-brief-with-structured-fields) |
| **Export Engine** | PDF, Docx, Notion, Google Docs exports | [Getting Started](guides/getting-started.md#export-your-report) |
| **Change Log** | Track all brief revisions | [Best Practices](guides/best-practices.md#change-log) |
| **3D Visualization** | Interactive agent network view | [Getting Started](guides/getting-started.md#analyze-results) |

### Simulation Modes

| Mode | Runtime | Best For | Docs |
|------|---------|----------|------|
| **Rule-Based** | ~5 min | Quick validation, statistical metrics | [Getting Started](guides/getting-started.md#5-run-the-simulation) |
| **LLM-Driven** | ~15 min | Deep insights, qualitative analysis | [Architecture](architecture/system-overview.md#simulation-engines) |

## Release Information

- **[Changelog](../CHANGELOG.md)** - Full version history and migration notes
- Current version: **v2.0.0** (2026-04-08)

## Project Structure

```
docs/
├── api/
│   └── openapi.yml              # Complete API specification
├── guides/
│   ├── getting-started.md       # 5-minute quick start
│   ├── best-practices.md        # Tips for great results
│   └── quick-reference.md       # Commands and patterns
├── developer/
│   ├── architecture.md          # System architecture
│   ├── contributing.md          # How to contribute
│   └── deployment-guide.md        # Production deployment
└── architecture/
    └── system-overview.md       # Diagrams and data flow
```

## External Resources

- **GitHub Repository**: https://github.com/arunpodili/pm-simulator
- **Issues & Bugs**: https://github.com/arunpodili/pm-simulator/issues
- **Live Demo**: https://pm-simulator.com

## Contributing to Documentation

See the [Contributing Guide](developer/contributing.md) for documentation standards.

To suggest documentation improvements:
1. Open an issue on GitHub
2. Or submit a PR with your changes
3. Follow the existing Markdown style

## License

Documentation is licensed under MIT License (same as project).
