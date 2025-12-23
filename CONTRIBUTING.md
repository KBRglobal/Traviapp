# 🤝 Contributing to Traviapp

Thank you for your interest in contributing!

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

---

## 📜 Code of Conduct

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/Traviapp.git
cd Traviapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Fill in required API keys
```

### 4. Start Development

```bash
npm run dev
```

---

## 🔄 Development Workflow

### Branch Naming

```
feature/description    # New features
fix/description        # Bug fixes
docs/description       # Documentation
refactor/description   # Code refactoring
```

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):

```
feat: add user authentication
fix: resolve memory leak in RSS processor
docs: update API documentation
refactor: simplify content generation logic
```

---

## 📥 Pull Request Process

### 1. Create Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

- Write clean, documented code
- Add tests if applicable
- Update documentation

### 3. Test

```bash
npm run check    # TypeScript
npm run build    # Build test
```

### 4. Submit PR

- Clear description of changes
- Reference related issues
- Screenshots for UI changes

### 5. Review

- Address feedback
- Keep PR focused and small

---

## 📝 Coding Standards

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for functions

### React

- Functional components only
- Custom hooks for shared logic
- Props interfaces defined

### API

- RESTful conventions
- Consistent error responses
- Input validation with Zod

### Database

- Use Drizzle ORM
- Migrations for schema changes
- No raw SQL queries

### Style

- Tailwind CSS for styling
- No inline styles
- Mobile-first responsive

---

## 🏗️ Architecture Guidelines

### Adding New Features

1. Design API endpoints first
2. Create database schema if needed
3. Implement backend logic
4. Build frontend components
5. Add documentation

### File Organization

```
# New API route
server/feature-routes.ts

# New page
client/src/pages/feature-page.tsx

# Shared types
shared/schema.ts
```

---

## 🐛 Bug Reports

Include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/logs
5. Environment details

---

## 💡 Feature Requests

Include:

1. Problem description
2. Proposed solution
3. Alternatives considered
4. Additional context

---

## ❓ Questions?

- Open a [Discussion](https://github.com/KBRglobal/Traviapp/discussions)
- Check existing [Issues](https://github.com/KBRglobal/Traviapp/issues)

---

Thank you for contributing! 🎉
