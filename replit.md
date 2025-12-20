# Travi CMS - Dubai Travel Content Management System

## Overview

Travi is a content management system designed for Dubai Travel, enabling creation and management of travel-focused content including attractions, hotels, and automated articles from RSS feeds. The system emphasizes SEO optimization, affiliate link integration, and a draft-first workflow where all content requires review before publishing.

The application follows a monorepo structure with a React frontend (Vite), Express backend, and PostgreSQL database using Drizzle ORM. Content is structured with modular blocks (hero, text, FAQ, CTA, etc.) and includes comprehensive SEO schema support (JSON-LD for TouristAttraction, Hotel, Article, FAQPage).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Design System**: Material Design 3 / Modern Admin approach focused on productivity and information density

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/*`
- **File Uploads**: Multer with Replit Object Storage integration
- **AI Integration**: OpenAI API for content generation assistance

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

### Content Model
The system uses a base `contents` table with type-specific extension tables:
- **contents**: Base table with common fields (title, slug, SEO metadata, blocks, status)
- **attractions**: Location, duration, target audience, pricing
- **hotels**: Star rating, room types, amenities, check-in/out times
- **articles**: Category, source RSS feed, auto-generated flag

Content blocks are stored as JSONB and support types: hero, text, image, gallery, FAQ, CTA, info_grid, highlights, tips.

### Workflow States
Content follows a status progression: draft → in_review → approved → scheduled → published

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets` → `./attached_assets`

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Object Storage
- **Replit Object Storage**: Media file storage via `@replit/object-storage`
- Requires `DEFAULT_OBJECT_STORAGE_BUCKET_ID` environment variable

### AI Services
- **OpenAI API**: Content generation and enhancement features
- Requires `OPENAI_API_KEY` environment variable

### Multi-Language SEO System
- **DeepL API**: Automatic content translation to 17 languages
- Requires `DEEPL_API_KEY` environment variable
- **Supported languages**: English (default), Arabic, Hindi, Chinese, Russian, Urdu, French, German, Persian, Bengali, Filipino, Spanish, Turkish, Italian, Japanese, Korean, Hebrew
- **URL structure**: English uses no prefix (/hotels), other languages use prefix (/fr/hotels, /ar/hotels)
- **RTL support**: Arabic, Hebrew, Persian, Urdu with comprehensive CSS rules
- **SEO features**: hreflang tags, multi-language sitemaps (sitemap-en.xml, sitemap-fr.xml, etc.), canonical URLs

### RSS Feed Integration
- Built-in XML parser for fetching and parsing RSS feeds
- Supports automatic article generation from feed items

### UI Component Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tabs, etc.)
- **shadcn/ui**: Pre-styled component library (new-york style variant)
- **Lucide React**: Icon library
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **vaul**: Drawer component