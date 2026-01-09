# Fix: Login Not Working - Missing Environment Variable

## 🔴 Problem Identified

The frontend is trying to connect to `http://localhost:8000` instead of the production backend because the `NEXT_PUBLIC_API_URL` environment variable is not configured in Vercel.

## ✅ Solution: Add Environment Variable to Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: `epi-brain-frontend`
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add the Environment Variable
1. Click **Add New** button
2. Fill in:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://api.epibraingenius.com`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

## 🎯 Expected Result

After redeployment:
- ✅ Login will work on all devices
- ✅ Frontend will connect to production backend
- ✅ All API calls will go to `https://api.epibraingenius.com`

## 🔍 How to Verify

1. Open https://www.epibraingenius.com on your phone
2. Try to login
3. Should successfully redirect to dashboard

## 📝 Alternative: Quick Test

If you want to test immediately without waiting for Vercel:

1. Open browser DevTools on desktop (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Try login again
5. Check Network tab for API calls
6. Should see calls to `https://api.epibraingenius.com`

## 🚨 Current Behavior (Before Fix)

- Frontend tries to connect to: `http://localhost:8000`
- This fails on mobile/external devices
- Login button shows "Signing in..." but nothing happens
- No error message (because request fails silently)

## ✅ Expected Behavior (After Fix)

- Frontend connects to: `https://api.epibraingenius.com`
- Login works on all devices
- Successful login redirects to dashboard
- Error messages show if credentials are wrong

---

## 🎯 Summary

**Issue**: Missing `NEXT_PUBLIC_API_URL` environment variable in Vercel
**Fix**: Add environment variable and redeploy
**Time**: 5 minutes
**Impact**: Login will work on all devices