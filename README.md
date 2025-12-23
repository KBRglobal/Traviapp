# 🏝️ Traviapp

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](/)
[![Node.js](https://img.shields.io/badge/node-20+-green)](/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6-blue)](/)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

> **Dubai & UAE Tourism Content Management System** with AI-Powered Content Generation, Multi-Language Support & Newsletter Automation

---

## 🚀 Features

- **AI Content Generation** - GPT-4o, Claude Sonnet 4, DALL-E 3
- **Multi-Language Support** - 17 languages with DeepL integration
- **RSS Feed Aggregation** - Auto-fetch, cluster & publish
- **Newsletter System** - Campaign builder with tracking
- **Real Estate Module** - Off-plan properties, calculators, leads
- **Enterprise Workflows** - Teams, approvals, content locking
- **SEO Optimization** - Audit tools, schema generation, keywords

---

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or yarn

---

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/KBRglobal/Traviapp.git
cd Traviapp

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API keys

# Database
npm run db:push

# Run
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS, Radix UI, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Drizzle ORM |
| **AI** | OpenAI GPT-4o, Anthropic Claude, DALL-E 3 |
| **Translation** | DeepL API |
| **Email** | Resend |
| **Cache** | Upstash Redis |

---

## 📁 Project Structure

```
Traviapp/
├── client/           # React frontend
│   └── src/
│       ├── pages/    # 131 page components
│       ├── components/
│       └── hooks/
├── server/           # Express backend
│   ├── routes.ts     # 187 API endpoints
│   ├── ai-generator.ts
│   └── services/
├── shared/           # Shared schema
│   └── schema.ts     # 45+ database tables
└── docs/             # Documentation
```

---

## 📖 Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](./docs/getting-started/) | Installation & setup |
| [Architecture](./docs/architecture/) | System design & diagrams |
| [API Reference](./docs/api/) | Endpoint documentation |
| [Database](./docs/database/) | Schema & migrations |
| [Development](./docs/development/) | Dev guide & standards |
| [Deployment](./docs/deployment/) | CI/CD & production |
| [Features](./docs/features/) | Feature documentation |
| [Integrations](./docs/integrations/) | External services |

---

## 🔧 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production
npm run db:push  # Push DB changes
npm run check    # TypeScript check
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT - see [LICENSE](./LICENSE)

---

## 📞 Support

- Documentation: [/docs](./docs/)
- Issues: [GitHub Issues](https://github.com/KBRglobal/Traviapp/issues)
