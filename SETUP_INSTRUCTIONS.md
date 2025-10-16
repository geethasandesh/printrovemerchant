# Setup Instructions for Product Template System

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in the `pt-merchant` directory:

```bash
# Copy the example file
cp .env.example .env
```

Then add the following to your `.env` file:

```env
VITE_APP_API_URL=http://localhost:3000/api
```

**Important:** Make sure the API URL matches your backend server URL!

### 2. Backend Server

Ensure your backend server is running:

```bash
cd pt-backend
npm run dev
```

The backend should be running at `http://localhost:3000`

### 3. Frontend Server

Start the frontend development server:

```bash
cd pt-merchant
npm run dev
```

The frontend will run at `http://localhost:3001`

---

## 🔧 Troubleshooting

### Error: "Failed to save template - 404 Not Found"

**Cause:** The API URL environment variable is not set correctly.

**Solutions:**
1. Check if `.env` file exists in `pt-merchant/` directory
2. Verify `VITE_APP_API_URL` is set to `http://localhost:3000/api`
3. Restart the frontend dev server after creating/modifying `.env`
4. Ensure backend server is running

### Error: "API URL is not configured"

**Cause:** Environment variable is missing.

**Solution:**
1. Create `.env` file from `.env.example`
2. Add `VITE_APP_API_URL=http://localhost:3000/api`
3. Restart `npm run dev`

### Error: "CORS Error" or "Network Error"

**Cause:** Backend server is not running or CORS is not configured.

**Solutions:**
1. Start backend server: `cd pt-backend && npm run dev`
2. Check backend CORS configuration allows `http://localhost:3001`
3. Verify backend is accessible at the URL in `.env`

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_APP_API_URL` | ✅ Yes | - | Backend API base URL (e.g., `http://localhost:3000/api`) |

---

## ✅ Verify Setup

### Test Backend API

Open your browser and navigate to:
```
http://localhost:3000/api/product-templates
```

You should see a JSON response (might be empty array if no templates exist).

### Test Frontend

1. Navigate to `http://localhost:3001/catalog`
2. Click on any product
3. Add some design elements (text/images)
4. Click "Save as Template"
5. Fill in template name
6. Click "Save Template"
7. You should be redirected to `/templates` with your saved template

---

## 🎯 Quick Test Flow

1. **Backend:** `cd pt-backend && npm run dev`
2. **Frontend:** `cd pt-merchant && npm run dev`
3. **Create `.env`:** Copy from `.env.example`
4. **Open:** `http://localhost:3001/catalog`
5. **Design:** Click product → add layers → save template
6. **Verify:** Navigate to `/templates` to see saved template

---

## 📞 Still Having Issues?

Check the browser console (F12) for detailed error messages. Common issues:

- **Red errors about API URL:** Missing/incorrect `.env` file
- **404 errors:** Backend not running or wrong API URL
- **CORS errors:** Backend CORS misconfiguration
- **Network errors:** Backend server unreachable

---

**Remember:** Always restart the dev server (`npm run dev`) after modifying `.env` files!


