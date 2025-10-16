# Deployment Guide for pt-merchant

## Prerequisites

- Backend API hosted and accessible
- Vercel account
- GitHub repository connected to Vercel

## Environment Variables

### Required Environment Variable

The application requires the following environment variable to connect to the backend API:

**Variable Name:** `VITE_APP_API_URL`  
**Production Value:** `https://printrove-api.vizdale.com/api`  
**Local Development Value:** `http://localhost:5001/api`

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name:** `VITE_APP_API_URL`
   - **Value:** `https://printrove-api.vizdale.com/api`
5. **IMPORTANT:** Select ALL environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. Click **Save**
7. **Redeploy** the application for changes to take effect

### Why Redeploy is Required

Vite (the build tool) bakes environment variables into the JavaScript bundle at **build time**. This means:
- Environment variables are NOT runtime configurable
- You MUST redeploy after adding/changing environment variables
- The variables are compiled into the static files during build

## Deployment Checklist

- [ ] Backend API is hosted and accessible
- [ ] `VITE_APP_API_URL` environment variable is set in Vercel
- [ ] Environment variable is set for ALL environments (Production, Preview, Development)
- [ ] Application has been redeployed after setting environment variables
- [ ] Verify the deployed app connects to the correct backend (check browser console for API URLs)

## Verifying Deployment

After deployment, open your browser's Developer Tools (F12) and check:

1. **Console Tab:** Should NOT see errors like:
   ```
   GET http://localhost:5001/api/... net::ERR_CONNECTION_REFUSED
   ```

2. **Network Tab:** API calls should go to:
   ```
   https://printrove-api.vizdale.com/api/...
   ```

If you still see `localhost:5001` in the URLs:
- ❌ Environment variable is not set correctly in Vercel
- ❌ OR you haven't redeployed after setting the variable

## Troubleshooting

### Issue: Still seeing "localhost:5001" in production

**Cause:** Environment variable not set or not redeployed

**Solution:**
1. Double-check environment variable is set in Vercel
2. Verify all three environments are checked (Production, Preview, Development)
3. Trigger a fresh deployment
4. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Network errors or CORS errors

**Cause:** Backend may not allow requests from your frontend domain

**Solution:**
1. Verify backend is running and accessible
2. Check backend CORS configuration allows your Vercel domain
3. Test backend directly: `curl https://printrove-api.vizdale.com/api/hello`

## Local Development

For local development, create a `.env` file in the project root:

```bash
# .env
VITE_APP_API_URL=http://localhost:5001/api
```

**Note:** `.env` file is gitignored and will not be committed.

## Configuration Files

- `vercel.json` - Vercel deployment configuration (SPA routing)
- `ENV_TEMPLATE.txt` - Template for environment variables
- `.env` - Local environment variables (not committed to git)

