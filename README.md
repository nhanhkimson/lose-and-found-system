# BIU Lost & Found System

BIU Lost & Found is a campus platform for reporting lost or found items, finding matches quickly, and helping students safely return belongings.

It is built with Next.js App Router, Prisma, PostgreSQL, and Cloudinary.

## Live Links

- Portfolio: [Nhanh Kimson](https://nhanhkimson.vercel.app/en)
- API docs (local): `http://localhost:3000/api-docs`
- OpenAPI JSON (local): `http://localhost:3000/api/openapi`

## Features

- **Lost & found posting**: Create clear reports with title, description, location, date, and category.
- **Image upload**: Attach item photos via Cloudinary.
- **Browse & filter**: Search items by keyword, type, category, status, and date.
- **Claim workflow**: Submit a claim with proof details and optional proof images.
- **Notifications**: Get in-app updates when actions happen.
- **Dashboard**: Manage your own listings and claims in one place.
- **Theme modes**: Switch between Light, Dark, and System.
- **API docs**: Explore available REST endpoints in Swagger UI.

## How to Use the System

### For students / users

1. Register or sign in.
2. Open `Report lost` or `Report found`.
3. Fill item details and upload photos.
4. Publish the listing.
5. Check your dashboard for updates.
6. If you found your item in the list, open it and submit a claim.

### For finders

1. Browse recent listings.
2. Open a matching item.
3. Click claim action (`I Found It` or `It's Mine`).
4. Provide proof and submit.

### For admins/staff

1. Monitor new claims and listings.
2. Review claim details and proof information.
3. Approve or reject based on verification policy.

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

## UI & Theme

The app uses a semantic design token system with automatic light/dark adaptation:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | Warm gold `#c9970c` | Bright gold `#e5b82e` | Buttons, links, accents |
| Background | Soft blue-gray `#f3f6fc` | Deep navy `#0b1020` | Page background |
| Surface | White | `#131b2e` | Cards, panels, inputs |
| Lost | Coral red | Soft red | Lost item badges |
| Found | Teal | Bright teal | Found item badges |

Theme switcher (top bar): **Light** · **Dark** · **System**

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

Open API docs:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi`

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
