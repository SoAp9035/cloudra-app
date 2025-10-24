# Deployment Guide

## Backend Deployment (Render.com)

### Configuration
The backend is configured to run with Gunicorn on Render.com.

**Important Settings in Render Dashboard:**
1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `gunicorn main:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --log-level info`
3. **Health Check Path**: `/health`

### Environment Variables (Set in Render Dashboard)
- `FLASK_ENV`: `production`
- `PYTHON_VERSION`: `3.11`

### Files Created
- `Procfile`: For Gunicorn configuration
- `render.yaml`: Infrastructure as code configuration
- `runtime.txt`: Python version specification

## Frontend Deployment (Netlify)

### Configuration
The frontend is built with Vite and deployed to Netlify.

**Important Settings in Netlify Dashboard:**
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Base Directory**: (leave empty or set to `frontend` if deploying from monorepo)

### Environment Variables (Set in Netlify Dashboard)
Add this in Netlify Dashboard → Site settings → Environment variables:
- Key: `VITE_API_BASE`
- Value: `https://cloudra-app.onrender.com`

### Files Created
- `netlify.toml`: Netlify configuration with redirects and headers
- `public/_redirects`: SPA routing fallback
- `.env.example`: Template for environment variables

## Deployment Steps

### Backend
1. Push changes to GitHub
2. In Render Dashboard:
   - Go to your service settings
   - Ensure start command is correct
   - Add health check path: `/health`
   - Click "Manual Deploy" → "Clear build cache & deploy"

### Frontend
1. Update `.env` with production backend URL
2. Push changes to GitHub
3. In Netlify Dashboard:
   - Add environment variable `VITE_API_BASE` = `https://cloudra-app.onrender.com`
   - Go to Deploys
   - Click "Clear cache and deploy site"

## Testing
After deployment:
1. Test backend health: `https://cloudra-app.onrender.com/health`
2. Test backend API: `https://cloudra-app.onrender.com/api/weather_probability?lat=40&lon=-74&month=6&day=15&analysis_mode=quick_analysis`
3. Test frontend: Open your Netlify URL

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify all dependencies are in `requirements.txt`
- Ensure timeout is set to at least 120 seconds (NASA API can be slow)

### Frontend Issues
- Verify `VITE_API_BASE` environment variable is set correctly
- Clear Netlify cache and redeploy
- Check browser console for CORS errors
- Ensure `.env` is not committed to git (it's in `.gitignore`)

### CORS Issues
- Backend allows origins from Netlify (*.netlify.app)
- If you have a custom domain, add it to the CORS configuration in `main.py`
