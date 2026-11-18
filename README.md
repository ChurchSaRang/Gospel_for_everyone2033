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

Create a PostgreSQL database (for example, in Supabase). In the Vercel project, add these environment variables for the Production environment and a separate database for Preview:

- `DATABASE_URL`: PostgreSQL runtime connection string. A Supabase pooler URL can be used for serverless runtime access.
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma migrations.
- `NEXTAUTH_SECRET`: unique random secret of at least 32 characters.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` if sending email.
- `PAYMENT_PROVIDER`, `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`, `PAYMENT_PUBLIC_URL`, `SUPPORT_FEE_AMOUNT`, and `SUPPORT_FEE_CURRENCY` if enabling payments.

Vercel uses `npm run build:production`. It generates the PostgreSQL Prisma client, deploys the PostgreSQL migrations, and then builds Next.js. The first deployment requires valid database URLs. Configure a separate Preview database so Preview builds do not migrate Production.

To create the first production administrator after deployment, temporarily set the Production `DATABASE_URL`, `DIRECT_URL`, `ADMIN_EMAIL`, and `ADMIN_INITIAL_PASSWORD` in your private local `.env` file, then run:

```powershell
npm run db:seed:production
```

The seed command updates the configured administrator’s password using scrypt and disables the old built-in development administrator. It also seeds the programme settings and batches. Back up your local `.env` before temporarily changing its database URLs, then restore it immediately after seeding. Never add production credentials to Vercel just for seeding, commit them, or send them in chat.

## Checks

```powershell
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
```

`npm run build` uses SQLite for local validation. Vercel runs `npm run build:production` and therefore requires PostgreSQL environment variables.
