# Fix Vercel 404 Error - Step by Step

The 404 error is happening because Vercel needs proper monorepo configuration. Follow these steps **exactly**.

---

## 🎯 Solution: Configure Vercel Project Settings

### Step 1: Go to Vercel Project Settings

1. Go to https://vercel.com and log in
2. Find your **"teendx"** project
3. Click on the project name
4. Click **"Settings"** (top navigation bar)

---

### Step 2: Set Root Directory (CRITICAL!)

1. In Settings, click **"General"** (left sidebar - should already be selected)
2. Scroll down to **"Root Directory"** section
3. Click **"Edit"**
4. Enter: `apps/web`
5. Click **"Save"**

**This tells Vercel that your Next.js app is in the `apps/web` folder, not the root!**

---

### Step 3: Configure Build & Output Settings

Still in Settings → General, scroll to **"Build & Development Settings"**:

1. Click **"Override"** toggle to enable custom settings

2. Set these values:

   **Framework Preset:**
   ```
   Next.js
   ```

   **Build Command:**
   ```
   cd ../.. && pnpm install && cd apps/web && pnpm build
   ```

   **Output Directory:**
   ```
   .next
   ```
   (This is relative to `apps/web` since we set Root Directory)

   **Install Command:**
   ```
   pnpm install
   ```

3. Click **"Save"** at the bottom

---

### Step 4: Add Environment Variables

1. Click **"Environment Variables"** in the left sidebar
2. Add these TWO variables:

   **Variable 1:**
   - Key: `CONVEX_DEPLOYMENT`
   - Value: `prod:dependable-dalmatian-854`
   - Environments: Check **all three** (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_CONVEX_URL`
   - Value: `https://dependable-dalmatian-854.convex.cloud`
   - Environments: Check **all three** (Production, Preview, Development)
   - Click **"Save"**

---

### Step 5: Redeploy

1. Click **"Deployments"** (top navigation)
2. Find the most recent deployment (top of the list)
3. Click the **three dots (⋯)** on the right
4. Click **"Redeploy"**
5. A popup appears - click **"Redeploy"** again to confirm
6. **DO NOT** select "Use existing build cache" - let it rebuild fresh

---

### Step 6: Wait and Verify

1. **Wait 2-4 minutes** for the deployment to complete
2. You'll see a "Building" status, then "Ready"
3. Once it says **"Ready"**, visit: https://teendx.vercel.app
4. You should see the **Teendx landing page** with:
   - Large "Teendx" heading
   - "Business Operating System for Teen Freelancers" subtitle
   - "Get Started" and "Log In" buttons

---

## ✅ Expected Result

After following these steps, your homepage should load successfully showing:

```
Teendx
Business Operating System for Teen Freelancers

[Get Started]  [Log In]
```

---

## 🐛 Still Getting 404?

### Check Build Logs

1. Go to Vercel → Deployments
2. Click on the latest deployment (should say "Ready" or "Error")
3. Click **"Building"** or **"View Function Logs"**
4. Look for errors in red

### Common Issues:

**Issue: "Root Directory not found"**
- Solution: Double-check you set Root Directory to `apps/web` exactly (no leading/trailing slashes)

**Issue: "pnpm: command not found"**
- Solution: Vercel should auto-detect pnpm from `packageManager` in package.json
- If not, go to Settings → General → Node.js Version and select latest

**Issue: "Module not found: convex"**
- Solution: Verify environment variables are set in **all environments**
- Make sure you clicked "Save" for each variable

**Issue: Build succeeds but still 404**
- Solution: This means Root Directory is wrong
- Go back to Settings → General → Root Directory
- Set to `apps/web` and Save
- Redeploy again

---

## 🔍 Alternative: Check Current Settings

To verify your current Vercel configuration:

1. Go to Settings → General
2. Check **"Root Directory"** - should show `apps/web`
3. Check **"Build & Development Settings"** - should show your custom commands
4. Go to Settings → Environment Variables
5. Verify both `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` are listed

---

## 📞 Last Resort: Manual Vercel CLI Deployment

If the dashboard approach doesn't work, deploy via CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to the project
cd /workspace/cmh4gtq1a017bq2i3zohc3qir/teendx

# Deploy from apps/web directory
cd apps/web
vercel --prod

# Follow the prompts:
# - Link to existing project? Yes
# - What's the name? teendx
# - In which directory? ./ (already in apps/web)
```

This will deploy directly and bypass any dashboard configuration issues.

---

## 💡 Understanding the Issue

The problem is that Vercel was trying to find a Next.js app at the **root** of your repository, but your Next.js app is actually in **apps/web/** (monorepo structure).

By setting **Root Directory** to `apps/web`, you tell Vercel:
- "Look for package.json in apps/web/"
- "Run build commands relative to apps/web/"
- "Find the .next output in apps/web/.next"

Without this setting, Vercel looks at the root, doesn't find a Next.js app, and returns 404.

---

**After completing Step 5 (Redeploy), your app should be live in 2-4 minutes!** 🚀
