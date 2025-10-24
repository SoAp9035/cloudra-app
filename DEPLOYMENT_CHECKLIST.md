# Quick Deployment Checklist

## ✅ Changes Made

### Frontend Changes
- [x] Updated `.env` with production backend URL
- [x] Created `netlify.toml` with proper configuration
- [x] Added `public/_redirects` for SPA routing
- [x] Updated `vite.config.js` with build optimizations
- [x] Added `.env` to `.gitignore`
- [x] Created `.env.example`

### Backend Changes
- [x] Updated CORS configuration to allow Netlify domains
- [x] Added `/health` endpoint for health checks
- [x] Added root `/` endpoint with API documentation
- [x] Created `Procfile` for Gunicorn
- [x] Created `render.yaml` for Render configuration
- [x] Created `runtime.txt` for Python version
- [x] Fixed Gunicorn entry point to use `main:app`
- [x] Created `.env.example`

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Configure production deployment for Netlify and Render"
git push origin main
```

### Step 2: Configure Backend (Render.com)
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your `cloudra-app` service
3. Go to **Settings**
4. Update **Start Command** to:
   ```
   gunicorn main:app --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120 --log-level info --access-logfile -
   ```
5. Set **Health Check Path** to: `/health`
6. Go to **Environment** tab and add:
   - `FLASK_ENV` = `production`
7. Click **Manual Deploy** → **Clear build cache & deploy**

### Step 3: Configure Frontend (Netlify)
1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to **Site configuration** → **Environment variables**
4. Add variable:
   - Key: `VITE_API_BASE`
   - Value: `https://cloudra-app.onrender.com`
5. Go to **Deploys**
6. Click **Trigger deploy** → **Clear cache and deploy site**

## 🧪 Testing After Deployment

### Test Backend
1. Health check: `https://cloudra-app.onrender.com/health`
   - Should return: `{"status": "healthy", "service": "cloudra-api"}`

2. Root endpoint: `https://cloudra-app.onrender.com/`
   - Should return API documentation

3. Weather API test:
   ```
   https://cloudra-app.onrender.com/api/weather_probability?lat=40&lon=-74&month=6&day=15&analysis_mode=quick_analysis
   ```

### Test Frontend
1. Open your Netlify URL
2. Try searching for a location
3. Check browser console (F12) for any errors
4. Verify API requests are going to `https://cloudra-app.onrender.com`

## 🐛 Troubleshooting

### If Frontend Still Shows Loading Forever:
1. Open browser DevTools (F12) → Network tab
2. Look for failed API requests
3. Check if requests are going to the correct backend URL
4. Look for CORS errors in Console tab

### If Backend Returns 500 Error:
1. Check Render logs: Dashboard → Your service → Logs
2. Look for Python errors or missing dependencies
3. Verify NASA API is responding (might be slow on first request)

### If CORS Errors:
1. Verify your Netlify URL is in the allowed origins in `backend/main.py`
2. Add your custom domain if you have one
3. Redeploy backend after changes

## 📝 Important Notes

- **First Request Slowness**: Render free tier goes to sleep after inactivity. First request may take 30-60 seconds
- **Request Timeout**: Set to 120 seconds because NASA API can be slow
- **Environment Variables**: Must be set in Netlify UI, not just in `.env` file
- **Cache Clearing**: Always clear cache when deploying to ensure fresh build

## ✨ After Successful Deployment

Your app should now be fully functional:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://cloudra-app.onrender.com`
- API Docs: `https://cloudra-app.onrender.com/`
