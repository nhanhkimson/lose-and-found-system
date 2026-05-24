# BIU Lost & Found System

A production-focused campus lost-and-found platform built with Next.js App Router, Prisma, and PostgreSQL.

This project helps students and staff report lost/found items, browse listings, submit claims, and manage notification workflows.

## Live Links

- Portfolio: [Nhanh Kimson](https://nhanhkimson.vercel.app/en)
- API docs (local): `http://localhost:3000/api-docs`
- OpenAPI JSON (local): `http://localhost:3000/api/openapi`

## Core Features

- Lost and found item reporting with multi-step validated forms.
- Image upload support via Cloudinary.
- Public item browsing with filtering, search, and detail pages.
- Claim submission flow with proof image support.
- Real-time notification updates via SSE.
- OpenAPI + Swagger UI documentation for REST endpoints.
- Authentication with NextAuth (session-based).
- Admin-capable moderation flows through role-aware logic.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript (strict mode)
- Tailwind CSS + shadcn/ui patterns
- Prisma ORM + PostgreSQL (Neon)
- NextAuth v5
- Zod + React Hook Form
- Cloudinary
- Swagger UI + swagger-jsdoc

## Project Structure

```text
src/
  app/
    (dashboard)/
    api/
      auth/
      claims/
      items/
      notifications/
      openapi/
      uploads/
    api-docs/
  components/
  lib/
    actions/
    cloudinary/
    openapi/
prisma/
  schema.prisma
  seed.ts
```

## Quick Start

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Create `.env` in the project root:

```env
# Database
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
# Optional (recommended for migrations on Neon)
DIRECT_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"

# Auth
NEXTAUTH_SECRET="<strong-random-secret>"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional social login
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional email
RESEND_API_KEY=""

# Cloudinary (client upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<cloud-name>"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="<unsigned-upload-preset>"
NEXT_PUBLIC_CLOUDINARY_FOLDER="biu-lost-found"

# Cloudinary server signing (for /api/uploads/signature)
CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud-name>"
```

### 3) Run database migration and seed

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4) Start development server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - start development server
- `pnpm build` - production build
- `pnpm start` - start production server
- `pnpm lint` - run ESLint
- `pnpm prisma db seed` - seed sample data

## REST API Coverage (OpenAPI)

Current documented endpoints include:

- `GET /api/items`
- `POST /api/items`
- `GET /api/items/{id}`
- `PATCH /api/items/{id}`
- `GET /api/items/{id}/similar`
- `POST /api/claims`
- `GET /api/notifications`
- `POST /api/notifications/mark-read`
- `GET /api/notifications/stream`
- `GET /api/notifications/sse`
- `POST /api/uploads/signature`
- `GET /api/openapi`
- `GET/POST /api/auth/{nextauth}`

## Deployment (Vercel)

1. Push your branch to GitHub.
2. Import repository into Vercel.
3. Set all environment variables in Vercel Project Settings.
4. Redeploy.

If build fails with lockfile mismatch, regenerate and commit:

```bash
pnpm install --lockfile-only
```

## Author

Built by Nhanh Kimson - iOS & Full-Stack Developer.

- Portfolio: [nhanhkimson.vercel.app/en](https://nhanhkimson.vercel.app/en)
- Email: `nhanhkimson.biu@gmail.com`
