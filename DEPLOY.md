# LifeOps™ - Quick Deploy Guide

## You're Almost There! 🎉

The app is **100% built and working**. I just need you to complete one step that requires your email access.

## What's Blocking Deployment

GitHub needs you to verify a new device. Check your email for "Verify a new device on your GitHub account" and click the link.

## After Email Verification (5 minutes total)

### 1. Push to GitHub (1 min)
```bash
cd /Users/sameeraziz/.gemini/antigravity/playground/prismic-crater

# Option A: If you have GitHub CLI
gh repo create lifeops --public --source=. --push

# Option B: Manual
# Go to https://github.com/new
# Create repository named "lifeops"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/lifeops.git
git push -u origin main
```

### 2. Deploy to Vercel (3 min)
1. Go to https://vercel.com/new
2. Click "Import" on your `lifeops` repository
3. Add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://vmmnuwxoiwivdmvhrhqz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ltaNA7nnVozoSCOcZIjg
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC0FRrO_rjHNe0WdShAOiKcbryZOypTfvk
   ```
4. Click "Deploy"

### 3. Update Supabase (1 min)
1. Go to https://supabase.com/dashboard/project/vmmnuwxoiwivdmvhrhqz/auth/url-configuration
2. Set Site URL to your Vercel URL (e.g., `https://lifeops.vercel.app`)
3. Add `https://lifeops.vercel.app/**` to Redirect URLs

## ✅ Done!

Your app will be live at `https://lifeops.vercel.app` (or your chosen domain).

**Test it**: Visit the URL, click "Get Started", and complete a morning check-in!

---

All code is committed and ready. See [full walkthrough](file:///Users/sameeraziz/.gemini/antigravity/brain/7d9972f1-6785-4a05-a853-1ee3d93417f7/walkthrough.md) for details.
