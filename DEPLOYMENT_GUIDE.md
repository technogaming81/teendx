# Teendx Deployment Guide

## 🚨 Current Issue: 404 Error on Vercel

The deployment is showing a 404 error because environment variables aren't configured properly in Vercel.

---

## ✅ Quick Fix Steps

### 1. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required Variables:**
```
CONVEX_DEPLOYMENT=prod:dependable-dalmatian-854
NEXT_PUBLIC_CONVEX_URL=https://dependable-dalmatian-854.convex.cloud
```

**Steps:**
1. Go to https://vercel.com/your-username/teendx
2. Click "Settings" → "Environment Variables"
3. Add both variables above
4. Make sure they're available for "Production", "Preview", and "Development"
5. Click "Save"

### 2. Redeploy

After adding environment variables:
```bash
# Option 1: Trigger redeploy from Vercel dashboard
Click "Deployments" → "..." menu → "Redeploy"

# Option 2: Push a new commit
git add .
git commit -m "Fix deployment config"
git push
```

### 3. Deploy Convex Functions (if not done yet)

```bash
cd apps/web
npx convex deploy --prod
```

---

## 📋 Complete Deployment Checklist

### Pre-Deployment

- [ ] **Convex Functions Deployed**
  ```bash
  cd apps/web
  npx convex deploy --prod
  ```
  This should output: "✓ Deployment complete"

- [ ] **Environment Variables Set in Vercel**
  - `CONVEX_DEPLOYMENT`
  - `NEXT_PUBLIC_CONVEX_URL`

- [ ] **Auth Providers Configured in Convex Dashboard**
  1. Go to https://dashboard.convex.dev/deployment/prod:dependable-dalmatian-854
  2. Navigate to "Settings" → "Environment Variables"
  3. Add Google OAuth credentials (if using):
     - `AUTH_GOOGLE_ID`
     - `AUTH_GOOGLE_SECRET`

- [ ] **Build succeeds locally**
  ```bash
  cd apps/web
  pnpm build
  ```

### Deployment Process

#### Step 1: Deploy Convex Backend
```bash
cd apps/web

# Deploy schema and functions to production
npx convex deploy --prod

# Verify deployment
npx convex dashboard
# Check that all tables and functions are visible
```

#### Step 2: Configure Vercel
1. Connect GitHub repo to Vercel
2. Set Root Directory: `apps/web`
3. Framework Preset: Next.js
4. Build Command: `pnpm build`
5. Install Command: `cd ../.. && pnpm install`
6. Output Directory: `.next`

#### Step 3: Add Environment Variables in Vercel
```env
CONVEX_DEPLOYMENT=prod:dependable-dalmatian-854
NEXT_PUBLIC_CONVEX_URL=https://dependable-dalmatian-854.convex.cloud
```

#### Step 4: Deploy
- Push to main branch or trigger manual deploy
- Wait for build to complete
- Test all routes

### Post-Deployment Verification

- [ ] Home page loads: `https://teendx.vercel.app`
- [ ] Can navigate to signup: `https://teendx.vercel.app/signup`
- [ ] Can navigate to login: `https://teendx.vercel.app/login`
- [ ] Dashboard loads (after login): `https://teendx.vercel.app/dashboard`
- [ ] Real-time updates work
- [ ] Convex functions execute without errors

---

## 🐛 Troubleshooting

### Issue: 404 on all routes

**Cause:** Missing environment variables or build failure

**Fix:**
1. Check Vercel build logs for errors
2. Verify environment variables are set
3. Ensure Convex deployment is complete
4. Check that `NEXT_PUBLIC_CONVEX_URL` is accessible

### Issue: "Cannot connect to Convex"

**Cause:** Wrong Convex URL or deployment not published

**Fix:**
```bash
# Verify Convex deployment
npx convex dashboard

# Check deployment status
npx convex deploy --prod --dry-run

# Redeploy if needed
npx convex deploy --prod
```

### Issue: Authentication not working

**Cause:** OAuth credentials not configured

**Fix:**
1. Go to Convex Dashboard → Settings → Environment Variables
2. Add OAuth credentials:
   ```
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   ```
3. Redeploy Convex functions:
   ```bash
   npx convex deploy --prod
   ```

### Issue: Build fails with "Module not found"

**Cause:** Missing dependencies or monorepo path issues

**Fix:**
```bash
# Install dependencies from root
cd /workspace/cmh4gtq1a017bq2i3zohc3qir/teendx
pnpm install

# Build from web app
cd apps/web
pnpm build
```

If still failing, check Vercel's install command is:
```
cd ../.. && pnpm install
```

### Issue: Functions not found (api.xxx is undefined)

**Cause:** Convex schema not deployed or types not generated

**Fix:**
```bash
cd apps/web

# Generate types
npx convex dev
# Wait for "✓ Types generated"
# Ctrl+C to stop

# Deploy to production
npx convex deploy --prod

# Commit generated files
git add convex/_generated
git commit -m "Add generated Convex types"
git push
```

---

## 🔒 Security Checklist

- [ ] Environment variables are set in Vercel (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] OAuth secrets are stored in Convex Dashboard only
- [ ] Production deployment uses HTTPS
- [ ] CORS is properly configured (Convex handles this)

---

## 📊 Monitoring

### Convex Dashboard
- **URL:** https://dashboard.convex.dev/deployment/prod:dependable-dalmatian-854
- **Monitor:**
  - Function execution logs
  - Database queries
  - Error rates
  - Active connections

### Vercel Dashboard
- **URL:** https://vercel.com/your-username/teendx
- **Monitor:**
  - Build status
  - Deployment logs
  - Analytics
  - Error tracking

---

## 🚀 Production Deployment Workflow

### For Future Updates:

1. **Develop Locally:**
   ```bash
   cd apps/web
   pnpm dev  # Runs Next.js + Convex dev
   ```

2. **Test Changes:**
   ```bash
   pnpm build  # Test production build
   ```

3. **Deploy Convex Functions:**
   ```bash
   npx convex deploy --prod
   ```

4. **Deploy Frontend:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push  # Vercel auto-deploys
   ```

5. **Verify:**
   - Check Vercel deployment logs
   - Test live site
   - Check Convex dashboard for errors

---

## 🆘 Quick Commands

```bash
# Check Convex deployment status
npx convex dashboard

# View Convex logs
npx convex logs --prod

# Redeploy Convex
npx convex deploy --prod

# Build Next.js locally
cd apps/web && pnpm build

# Test production build locally
cd apps/web && pnpm build && pnpm start
```

---

## 📞 Support

- **Convex Issues:** https://discord.gg/convex
- **Vercel Issues:** https://vercel.com/support
- **Teendx Issues:** Check `planning.md` for feature specs

---

## ✅ Expected Result After Fix

After following the steps above, you should see:

1. **Home Page** - Landing page with "Get Started" and "Log In" buttons
2. **Signup** - User registration form
3. **Login** - Authentication page
4. **Dashboard** - Real-time stats and navigation
5. **Clients** - Client management with live updates

The 404 error will be resolved once environment variables are properly configured in Vercel.
