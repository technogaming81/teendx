# 🚨 FIX 404 ERROR - ACTION REQUIRED

Your Vercel deployment at `https://teendx.vercel.app` is showing a 404 error.

## ⚡ Quick Fix (5 minutes)

### Step 1: Set Environment Variables in Vercel

1. Go to: https://vercel.com (log in to your account)
2. Find your "teendx" project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Add these two variables:

```
Variable Name: CONVEX_DEPLOYMENT
Value: prod:dependable-dalmatian-854
```

```
Variable Name: NEXT_PUBLIC_CONVEX_URL
Value: https://dependable-dalmatian-854.convex.cloud
```

6. Make sure **ALL environments** are checked:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

7. Click **Save** for each variable

### Step 2: Deploy Convex Functions

Open terminal and run:

```bash
cd /workspace/cmh4gtq1a017bq2i3zohc3qir/teendx/apps/web

# Install dependencies if needed
pnpm install

# Deploy Convex backend to production
npx convex deploy --prod
```

You should see:
```
✓ Deployment complete
```

### Step 3: Redeploy on Vercel

**Option A: Via Dashboard**
1. Go to Vercel dashboard → Your project
2. Click **Deployments** tab
3. Find latest deployment
4. Click the **⋯** menu
5. Click **Redeploy**
6. Click **Redeploy** again to confirm

**Option B: Via Git Push**
```bash
cd /workspace/cmh4gtq1a017bq2i3zohc3qir/teendx

# Make a small change to trigger redeploy
git add .
git commit -m "fix: Add Convex environment variables"
git push
```

### Step 4: Wait & Verify

1. Wait 2-3 minutes for Vercel to rebuild
2. Visit: https://teendx.vercel.app
3. You should see the landing page with "Get Started" and "Log In" buttons

---

## ✅ What You Should See After Fix

### Home Page (https://teendx.vercel.app)
- Big "Teendx" heading
- "Business Operating System for Teen Freelancers" subtitle
- "Get Started" and "Log In" buttons

### After Signup/Login
- Dashboard with stats (Total Income, Pending, Expenses, Clients)
- Navigation menu (Dashboard, Clients, Invoices, etc.)
- Real-time data updates

---

## 🐛 Still Getting 404?

### Check Build Logs

1. Go to Vercel dashboard → Deployments
2. Click on the latest deployment
3. Check the **Build Logs** tab
4. Look for errors (lines in red)
5. Share the error message if you need help

### Common Issues

**Issue:** "Cannot find module 'convex'"
**Fix:** Make sure you ran `pnpm install` in the apps/web directory

**Issue:** "NEXT_PUBLIC_CONVEX_URL is undefined"
**Fix:** Double-check environment variables are saved in Vercel

**Issue:** "Failed to load Convex client"
**Fix:** Make sure you ran `npx convex deploy --prod`

---

## 📞 Need Help?

If you're still seeing the 404 error after following these steps:

1. **Check Vercel Build Logs:**
   - Go to Vercel dashboard
   - Click your deployment
   - Look for error messages in red

2. **Check Convex Dashboard:**
   - Go to: https://dashboard.convex.dev/deployment/prod:dependable-dalmatian-854
   - Verify functions are deployed
   - Check for any error logs

3. **Share Details:**
   - What error message do you see in Vercel build logs?
   - Does `npx convex deploy --prod` succeed?
   - Can you access the Convex dashboard?

---

## ⏱️ Expected Timeline

- **Setting environment variables:** 2 minutes
- **Deploying Convex:** 1 minute
- **Vercel rebuild:** 2-3 minutes
- **Total:** ~5 minutes

After this, your app should be live and working! 🎉
