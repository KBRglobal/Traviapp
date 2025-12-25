# Traviapp - Dubai Travel Guide CMS

A comprehensive content management system for Dubai travel guides, built with React, Express, and PostgreSQL.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for all required environment variables.

## Architecture

```
├── client/          # React frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui)
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes/      # API route handlers
│   ├── services/    # Business logic
│   └── lib/         # Database utilities
├── shared/          # Shared types and schema
│   └── schema.ts    # Drizzle ORM + Zod schemas
└── migrations/      # Database migrations
```

## Key Features

- **AI Writers System**: 10 specialized AI writers with unique voices and expertise
- **Multi-language Support**: 16+ languages with automatic translation
- **SEO Optimization**: 4-tier validation system with auto-fix
- **AI Content Generation**: Unified system using specialized AI writers
- **Image Management**: WebP conversion, thumbnails, lazy loading
- **Role-Based Access**: Admin, Editor, Author, Viewer roles
- **Newsletter System**: Campaign management with tracking
- **PWA Support**: Offline-first with service worker

## Recent Updates (December 2025)

- ✅ **Optimized Codebase**: Removed 1,000+ lines of unused code
- ✅ **TypeScript Compliance**: All modules compile without errors
- ✅ **Unified AI System**: AI Writers as the primary content generator
- ✅ **Improved Maintainability**: Cleaner, more focused architecture

## API Health Check

```bash
curl http://localhost:5000/api/health
```

## Documentation

- [System Architecture](./replit.md)
- [Product Requirements](./PRD.md)
- [Design Guidelines](./design_guidelines.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [AI Writers System](./AI_WRITERS_IMPLEMENTATION.md)
- [AI Writers Migration Guide](./docs/ai-writers-migration-guide.md)
- [AI Writers API Reference](./docs/ai-writers-api-reference.md)

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express, Drizzle ORM, PostgreSQL
- **AI**: OpenAI GPT-4, DALL-E
- **Caching**: Redis (Upstash) + in-memory fallback
- **Storage**: S3-compatible object storage

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run db:push   # Push schema to database
npm run db:studio # Open Drizzle Studio
```

## License

Private - All rights reserved
