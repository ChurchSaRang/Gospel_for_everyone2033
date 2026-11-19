# Gospel for Everyone

Next.js application for the Gospel for Everyone programme and Korea training applications.

## Local development

Requirements: Node.js 20.9 or newer and npm.

1. Copy `.env.example` to `.env` and set a unique `NEXTAUTH_SECRET`. Add SMTP settings only if local email delivery is needed.
2. The default `DATABASE_URL` uses a local SQLite database at `prisma/dev.db`.
3. Install dependencies and apply local migrations:

   ```powershell
   npm ci
   npm run prisma:migrate
   ```

4. To create or reset the local super-admin, set `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` in `.env` (minimum 12 characters), then run:

   ```powershell
   npm run db:seed
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

The local database is intentionally ignored by Git. Keep applicant records and credentials out of commits.

## Production database and Vercel

Production uses PostgreSQL; development uses SQLite. The schemas share the same models:

- `prisma/schema.prisma` is the SQLite development schema.
- `prisma/postgres/schema.prisma` and its own migrations are for production PostgreSQL.

Create a PostgreSQL database (for example, in Neon). In the Vercel project, add these environment variables for the Production environment and a separate database or Neon branch for Preview:

- `DATABASE_URL`: pooled PostgreSQL runtime connection string for app requests.
- `DATABASE_URL_UNPOOLED`: direct PostgreSQL connection string for Prisma migrations.
- `NEXTAUTH_SECRET`: unique random secret of at least 32 characters.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` if sending email.
- `PAYMENT_PROVIDER`, `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`, `PAYMENT_PUBLIC_URL`, `SUPPORT_FEE_AMOUNT`, and `SUPPORT_FEE_CURRENCY` if enabling payments.

Vercel uses `npm run build:production`. It generates the PostgreSQL Prisma client and builds Next.js; it does not apply migrations. Apply migrations to the intended database with `npm run prisma:migrate:production` before deploying code that depends on the new schema. Keep Preview isolated from Production.

To create the first production administrator after migration, set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `ADMIN_EMAIL`, and `ADMIN_INITIAL_PASSWORD` in your private environment, then run:

```powershell
npm run db:seed:production
```

The seed command updates the configured administrator’s password using scrypt and disables the old built-in development administrator. It also seeds the programme settings and batches. Do not overwrite your SQLite `.env` with production URLs; use a separate private env file or environment variables for production seeding. Never commit production credentials or send them in chat.

## Checks

```powershell
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
```

`npm run build` uses SQLite for local validation. Vercel runs `npm run build:production` and therefore requires PostgreSQL environment variables.
