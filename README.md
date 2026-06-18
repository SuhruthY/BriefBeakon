# BriefBeakon

> A Beacon for What Matters Today.

An intelligent AI-powered digital newspaper that cuts through the noise and highlights what matters most.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Backend:** Supabase (PostgreSQL)
- **AI:** OpenAI / Gemini API

## Getting Started

```bash
npm install
npm run dev
```

## Configuration

Edit `config/briefbeacon.json` to control:
- Publishing schedule (times, timezone)
- Category weights (articles per category)
- Information sources
- AI provider settings

## Build

```bash
npm run build
```

## How It Works

1. GitHub Actions runs hourly
2. At configured publishing times, content is auto-generated
3. AI collects, analyzes, and writes articles
4. Content is committed to the repo
5. GitHub Pages re-deploys automatically
