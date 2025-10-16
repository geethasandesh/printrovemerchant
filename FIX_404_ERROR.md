# Fix: Failed to save template (404 Error)

## 🔴 Problem

You're seeing this error:
```
Failed to save template. Please try again.
Failed to load resource: the server responded with a status of 404 (Not Found)
Error saving template: Error: Failed to save template
```

## ✅ Solution

The issue is that the **environment variable is not configured**. Here's how to fix it:

### Step 1: Create `.env` File

In the `pt-merchant` directory, create a file named `.env`:

**On Windows (PowerShell):**
```powershell
cd pt-merchant
New-Item -Path ".env" -ItemType File -Force
```

**On Windows (Command Prompt):**
```cmd
cd pt-merchant
type nul > .env
```

**On Mac/Linux:**
```bash
cd pt-merchant
touch .env
```

### Step 2: Add API URL to `.env`

Open the `.env` file and add this line:

```env
VITE_APP_API_URL=http://localhost:3000/api
```

**Important Notes:**
- Replace `http://localhost:3000` with your backend server URL if different
- Make sure there are NO spaces around the `=` sign
- Save the file

### Step 3: Restart Frontend Server

Stop your current dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

**Why?** Vite only reads `.env` files when it starts, so you must restart.

### Step 4: Verify Backend is Running

Make sure your backend server is running:

```bash
cd pt-backend
npm run dev
```

It should show something like:
```
Server is running on port 3000
```

### Step 5: Test the Fix

1. Open your browser to `http://localhost:3001`
2. Navigate to product catalog
3. Click on a product to open the design editor
4. Add some text or an image
5. Click "Save as Template"
6. Enter a name and click "Save Template"
7. ✅ It should save successfully and redirect to `/templates`

---

## 🔍 Verify Your Setup

### Check if `.env` file exists:

**Windows:**
```powershell
cd pt-merchant
dir .env
```

**Mac/Linux:**
```bash
cd pt-merchant
ls -la .env
```

### Check `.env` file content:

**Windows:**
```powershell
Get-Content .env
```

**Mac/Linux:**
```bash
cat .env
```

You should see:
```
VITE_APP_API_URL=http://localhost:3000/api
```

### Test Backend API Manually:

Open your browser and go to:
```
http://localhost:3000/api/product-templates
```

You should see JSON response (might be empty `[]` if no templates exist).

If you see a 404 here, your backend is not running or the route is not registered.

---

## 🚨 Still Not Working?

### Issue 1: Backend not running

**Error:** Network error or connection refused

**Solution:**
```bash
cd pt-backend
npm install
npm run dev
```

### Issue 2: Wrong port

**Error:** Still getting 404

**Check:** What port is your backend running on?

If it's on port 5000 instead of 3000:
```env
VITE_APP_API_URL=http://localhost:5000/api
```

### Issue 3: CORS error

**Error:** "CORS policy" error in console

**Solution:** Check backend CORS configuration allows `http://localhost:3001`

### Issue 4: Environment variable not loaded

**Check in browser console:**
```javascript
console.log(import.meta.env.VITE_APP_API_URL)
```

If it shows `undefined`:
1. Make sure `.env` file is in `pt-merchant` directory (NOT `pt-backend`)
2. Restart the dev server
3. Clear browser cache

---

## 📂 Correct File Structure

```
printrove/
├── pt-backend/
│   ├── src/
│   └── package.json
├── pt-merchant/
│   ├── .env          ← CREATE THIS FILE HERE
│   ├── .env.example  ← Reference file
│   ├── src/
│   └── package.json
└── pt-admin/
```

---

## ✅ Expected Result

After following these steps:

1. ✅ `.env` file exists in `pt-merchant/`
2. ✅ Contains `VITE_APP_API_URL=http://localhost:3000/api`
3. ✅ Backend server is running
4. ✅ Frontend server restarted
5. ✅ Saving template works without 404 error
6. ✅ Templates appear in `/templates` page

---

## 🎯 Quick Fix Command Summary

```bash
# 1. Create .env file
cd pt-merchant
echo "VITE_APP_API_URL=http://localhost:3000/api" > .env

# 2. Restart frontend
npm run dev

# 3. In another terminal, ensure backend is running
cd pt-backend
npm run dev
```

---

**That's it!** The 404 error should be fixed now. The issue was simply that the frontend didn't know where to find the backend API.


