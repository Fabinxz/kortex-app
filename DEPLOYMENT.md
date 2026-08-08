# Deployment Guide - KORTEX

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- [Vercel account](https://vercel.com) (free tier works)
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### Step 1: Set Up Database

#### Using Neon (Recommended - Free Tier)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project: "kortex-db"
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/kortex?sslmode=require`)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - KORTEX dashboard"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/kortex-app.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: Leave default
   - **Output Directory**: Leave default

### Step 4: Environment Variables

In Vercel's project settings, add:

```
DATABASE_URL=postgresql://your-neon-connection-string
```

### Step 5: Deploy!

Click "Deploy" and wait ~2 minutes.

### Step 6: Seed the Database

After first deployment, run seed command locally:

```bash
# Make sure your local .env has the same DATABASE_URL
pnpm prisma:push
pnpm prisma:seed
```

Or use Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel env pull .env
pnpm prisma:push
pnpm prisma:seed
```

## 🔧 Post-Deployment

### Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Build Commands

Vercel automatically runs:
- `npm install` (or detects pnpm/yarn)
- `prisma generate` (in postinstall)
- `next build`

### Environment for Production

```env
DATABASE_URL="your-production-database-url"
NODE_ENV="production"
```

## 📊 Prisma Studio in Production

To view/edit data in production:

```bash
# Pull production env
vercel env pull .env.production

# Use production DATABASE_URL
DATABASE_URL="your-production-url" pnpm prisma studio
```

## 🐛 Troubleshooting

### Build Fails: "Prisma Client Not Generated"

Add to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Timeout

- Make sure `?sslmode=require` is in connection string
- Check if database accepts connections from Vercel IPs

### "Module not found" Errors

- Clear Vercel cache: Settings → General → Clear Cache
- Redeploy

## 🌍 Alternative Platforms

### Netlify

Similar process to Vercel. Use environment variables in build settings.

### Railway

1. Create new project
2. Add PostgreSQL service (auto-provisioned)
3. Connect GitHub repo
4. Add environment: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
5. Deploy

### Self-Hosted (VPS)

```bash
# On your server
git clone your-repo
cd kortex-app
pnpm install
pnpm prisma:push
pnpm prisma:seed
pnpm build
pnpm start # Runs on port 3000
```

Use PM2 or systemd for process management.

## 🔒 Security Checklist

- [ ] Database URL is in environment variables (not hardcoded)
- [ ] `.env` is in `.gitignore`
- [ ] Database has SSL enabled
- [ ] Database user has appropriate permissions only
- [ ] No demo data in production (re-seed with real data)

## 📈 Performance Tips

1. **Database Connection Pooling**: Prisma handles this automatically
2. **Edge Deployment**: Consider Vercel Edge Runtime for faster response
3. **Image Optimization**: Next.js handles automatically
4. **Caching**: Set appropriate `revalidate` times in Server Components

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to `main` branch.

To disable auto-deploy for specific commits:

```bash
git commit -m "WIP: feature [skip ci]"
```

---

**Need help?** Check [Vercel Docs](https://vercel.com/docs) or [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
