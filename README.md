# HES Registration — Hamro Event Solutions LLC

Child registration portal for the HES Babysitting event on **Saturday, May 30, 2026**.

Built with: Next.js 14 · TypeScript · Tailwind CSS · Prisma · Supabase · Stripe · NextAuth

---

## Local Development

### 1. Clone and install

```bash
cd hes-registration
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

Required values before running locally:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Run: `openssl rand -base64 32`
- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up the database

```bash
npm run db:push      # Create tables from schema
npm run db:seed      # Seed admin users
```

### 4. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Azure App Service Deployment

### Prerequisites

- Azure account with an App Service (Linux, Node 20)
- GitHub repository with this code
- All services provisioned (see below)

### Services to provision

| Service | Purpose | Free tier? |
|---|---|---|
| **Azure App Service** (B1 or higher) | Host the Next.js app | No |
| **Supabase** (free tier) | PostgreSQL DB + file storage | Yes |
| **Stripe** | Card payments | Pay-per-transaction |
| **Resend** | Transactional email | Yes (100/day free) |

### Step-by-step Azure setup

#### 1. Create Azure App Service

In Azure Portal → App Services → Create:
- **Name:** `hes-registration` (or your preferred name)
- **Publish:** Code
- **Runtime stack:** Node 20 LTS
- **OS:** Linux
- **Region:** East US (or nearest)
- **Plan:** B1 Basic (minimum for production)

#### 2. Configure environment variables in Azure

In your App Service → Configuration → Application settings, add every variable from `.env.example`:

```
NEXT_PUBLIC_APP_URL         = https://your-app.azurewebsites.net
DATABASE_URL                = postgresql://...
NEXTAUTH_SECRET             = (generate with openssl)
NEXTAUTH_URL                = https://your-app.azurewebsites.net
STRIPE_SECRET_KEY           = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET       = whsec_...
RESEND_API_KEY              = re_...
EMAIL_FROM                  = noreply@hamroeventsolutions.com
EMAIL_ADMIN                 = kshitiz@hamroeventsolutions.com
EMAIL_ADMIN_BACKUP          = manish@hamroeventsolutions.com
SUPABASE_URL                = https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY   = eyJ...
STORAGE_BUCKET              = hes-waivers
REGISTRATION_FEE_CENTS      = 2500
MAX_CHILDREN_CAPACITY       = 20
ZELLE_RECIPIENT_EMAIL       = payments@hamroeventsolutions.com
ZELLE_RECIPIENT_NAME        = Hamro Event Solutions LLC
NEXT_PUBLIC_VENUE_ADDRESS   = [venue address]
ADMIN_DEFAULT_PASSWORD      = [strong password — change after first login]
```

Also set:
- `WEBSITE_NODE_DEFAULT_VERSION` = `~20`
- `SCM_DO_BUILD_DURING_DEPLOYMENT` = `false`

#### 3. Set startup command

In App Service → Configuration → General settings → Startup Command:
```
node server.js
```

#### 4. Get publish profile for GitHub Actions

In App Service → Overview → Download publish profile.

In your GitHub repo → Settings → Secrets → Actions, add:
- `AZURE_WEBAPP_PUBLISH_PROFILE` — paste the publish profile XML
- All other secrets from the env list above

Update `.github/workflows/deploy-azure.yml`:
```yaml
env:
  AZURE_WEBAPP_NAME: your-actual-app-service-name
```

#### 5. Set up Supabase storage

1. Create a Supabase project
2. Go to Storage → Create bucket `hes-waivers`
3. Set bucket to Public (so PDF download links work)
4. Copy `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Azure config

#### 6. Set up Stripe webhook

After deploying, register the webhook in Stripe Dashboard:
- Endpoint: `https://your-app.azurewebsites.net/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

#### 7. Deploy

Push to `main` branch — GitHub Actions will build and deploy automatically.

Or deploy manually:
```bash
npm run build
# Then zip-deploy via Azure CLI:
az webapp deploy --resource-group <rg> --name hes-registration --src-path deploy.zip
```

#### 8. Run database migrations on Azure

After first deploy, run from Azure App Service Console (or via SSH):
```bash
npx prisma db push
npx prisma db seed  # Seeds admin users
```

Or use the Supabase SQL editor to run the migration SQL directly.

---

## Admin Access

After seeding, log in at `/admin/login` with:

| Name | Email | Role |
|---|---|---|
| Kshitiz Shrestha | kshitiz@hamroeventsolutions.com | Super Admin |
| Manish Chaudhary | manish@hamroeventsolutions.com | Super Admin |
| Adriane Diaz | adriane@hamroeventsolutions.com | Staff |
| Riya Dev | riya@hamroeventsolutions.com | Staff |
| Sol Moure Moreno | sol@hamroeventsolutions.com | Staff |

Password: value of `ADMIN_DEFAULT_PASSWORD` — **change immediately after first login**.

---

## Registration Flow

`/` → Landing page  
`/register` → Step 1: Parent info  
`/register/children` → Step 2: Children + authorized pickups  
`/register/waiver` → Step 3: E-waiver + digital signature  
`/register/payment` → Step 4: Pay by card (Stripe) or Zelle  
`/register/review` → Step 5: Review & submit  
`/register/success` → Confirmation page  

---

## Contacts

- Kshitiz Shrestha: (312) 627-0600
- Manish Chaudhary: (847) 224-4156
