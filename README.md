# Gospel for Everyone

Next.js application for the Gospel for Everyone programme and Korea training applications.

## Local development

Requirements: Node.js 20.9 or newer and npm.

1. Copy `.env.example` to `.env` and set a unique `NEXTAUTH_SECRET`. Add Resend settings if local email delivery is needed.
2. The default `DATABASE_URL` uses a local SQLite database at `prisma/dev.db`.
3. Install dependencies and apply local migrations:

   ```powershell
   npm ci
   npm run prisma:migrate
   ```

4. To create or reset the local super-admin, set `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` in `.env` (minimum 6 characters), then run:

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
- `RESEND_API_KEY` and `EMAIL_FROM` if sending email. `EMAIL_REPLY_TO` is optional.
- `PAYMENT_PROVIDER`, `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET`, `PAYMENT_PUBLIC_URL`, `SUPPORT_FEE_AMOUNT`, and `SUPPORT_FEE_CURRENCY` if enabling payments.

Vercel uses `npm run build:production`. It generates the PostgreSQL Prisma client and builds Next.js; it does not apply migrations. Apply migrations to the intended database with `npm run prisma:migrate:production` before deploying code that depends on the new schema. Keep Preview isolated from Production.

## Set up applicant payments with NOWPayments

The status page creates a hosted NOWPayments invoice. Applicants can choose an available cryptocurrency on the provider's invoice page. The app marks an application paid only after a signed IPN callback reports `finished`; returning from the invoice page by itself never confirms payment. See the [NOWPayments API documentation](https://documenter.getpostman.com/view/7907941/2s93JusNJt).

1. Create/sign in to a NOWPayments account and set up its Primary balance.
2. In NOWPayments, create an API key and generate an IPN secret. Save both securely; the IPN secret may only be shown when it is created.
3. Configure local `.env` for development or a test deployment:

   ```dotenv
   PAYMENT_PROVIDER="nowpayments"
   NOWPAYMENTS_API_KEY="your_api_key"
   NOWPAYMENTS_IPN_SECRET="your_ipn_secret"
   PAYMENT_PUBLIC_URL="https://your-public-site.example"
   SUPPORT_FEE_AMOUNT="500"
   SUPPORT_FEE_CURRENCY="USD"
   ```

   `PAYMENT_PUBLIC_URL` must be your public HTTPS site origin, without a path. NOWPayments cannot send IPN callbacks to `localhost`.

4. In Vercel, add the same variables under **Project → Settings → Environment Variables** for the intended environment. Use the public production site URL for Production and keep Preview on separate payment credentials/configuration where available.
5. In NOWPayments, configure IPN to use the callback URL `https://your-public-site.example/api/payments/nowpayments/ipn`. The checkout request also supplies this callback URL automatically. The server verifies the `x-nowpayments-sig` HMAC-SHA512 signature, invoice ID, confirmation code, amount, and currency before changing application status.
6. Deploy, then complete a controlled end-to-end payment and confirm that the applicant status changes only after the signed callback arrives. Check the NOWPayments payment history and Vercel function logs if the status does not update. Never treat the browser redirect as proof of payment.

The app intentionally does not auto-confirm repeated deposits; those callbacks are acknowledged for manual review because NOWPayments warns that repeated/partial deposits may not cover the full invoice. `PayPal` is shown as **coming soon** and is not connected yet. The payment record already stores a provider name, so PayPal can later be added with its own order creation, capture, and verified webhook flow without treating browser redirects as payment confirmation.

## Set up transactional email with Resend

The app uses Resend for application-received, selection-notice, and batch-assigned emails. No database migration is needed.

1. Create or sign in to your account at [resend.com](https://resend.com/).
2. In Resend, add a domain that you control. For production, use a domain or subdomain you want to send from.
3. Open the domain's DNS settings at your domain registrar and add the records Resend displays. Do not copy DNS values from another domain; the records are specific to your Resend domain.
4. Wait for Resend to verify the domain. Do not continue to production sending until the dashboard reports it as verified.
5. In Resend, create an API key with permission to send email. Copy it once and store it as a secret. Do not commit it or share it in chat.
6. In your local `.env`, set:

   ```dotenv
   RESEND_API_KEY="re_..."
   EMAIL_FROM="Gospel for Everyone <noreply@your-verified-domain.com>"
   EMAIL_REPLY_TO="support@your-verified-domain.com"
   ```

   Replace the example addresses with addresses on the domain you verified. `EMAIL_REPLY_TO` is optional; omit it if replies should go to the sender address. Keep the quotes around the `EMAIL_FROM` value.

7. Restart the local development server so it loads the new environment values. Submit a test application using an inbox you control, then confirm the email appears in that inbox and in the Resend email logs. Approval and batch assignment also send emails.
8. For production, open **Vercel → Project → Settings → Environment Variables** and add `RESEND_API_KEY` and `EMAIL_FROM` for **Production**. Add `EMAIL_REPLY_TO` if desired. Add the same variables to **Preview** only if preview deployments should send email; use an isolated/test Resend setup there when possible.
9. Redeploy after saving the Vercel variables. Test a real application receipt and check **Resend → Emails** if delivery fails. The application records send results in its email log; a missing API key or rejected Resend request is recorded as a failed send.

The sender in `EMAIL_FROM` must use a verified Resend domain. The API key is server-only and must never use a `NEXT_PUBLIC_` prefix.

To create or reset the production Super Admin without reseeding programme settings or batches, open PowerShell in the `Frontend` directory and run:

```powershell
function Read-PrivateValue([string]$Prompt) {
    $secure = Read-Host -Prompt $Prompt -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

$env:DATABASE_URL = Read-PrivateValue "Production pooled DATABASE_URL"
$env:DATABASE_URL_UNPOOLED = Read-PrivateValue "Production direct DATABASE_URL_UNPOOLED"
$env:ADMIN_EMAIL = Read-Host "Admin email"
$env:ADMIN_INITIAL_PASSWORD = Read-PrivateValue "Admin password (minimum 6 characters)"
try {
    npm run admin:create:production
} finally {
    Remove-Item Env:DATABASE_URL, Env:DATABASE_URL_UNPOOLED, Env:ADMIN_EMAIL, Env:ADMIN_INITIAL_PASSWORD -ErrorAction SilentlyContinue
}
```

Use the production database URLs from your database provider. The command creates or resets only the specified Super Admin and disables the built-in development administrator. It does not update programme settings or batches. The password is read without echoing and the temporary environment variables are removed when the command finishes. Do not commit credentials or send them in chat.

Ensure `NEXTAUTH_SECRET` is set in Vercel to a unique random value of at least 32 characters. Then sign in at `https://your-domain/admin/login`. Six characters is the minimum accepted length; for an administrator account, use a much longer unique password.

## Checks

```powershell
npm run lint
npm run typecheck
npm run prisma:validate
npm run build
```

`npm run build` uses SQLite for local validation. Vercel runs `npm run build:production` and therefore requires PostgreSQL environment variables.
