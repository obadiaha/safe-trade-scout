# Safe Trade Scout - Railway Deployment Guide

## ✅ Deployment Status

**Project is READY for deployment!**

- ✅ Build tested and passes
- ✅ Railway configuration file (`railway.json`) present
- ✅ Health check endpoint available (`GET /api/check`)
- ✅ Code committed and pushed to GitHub
- ✅ No required environment variables (uses public APIs)

## 🚀 Deploy to Railway

### Option 1: Deploy via GitHub Integration (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Login with your account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `obadiaha/safe-trade-scout`

3. **Configuration**
   - Railway will auto-detect the Next.js project
   - The `railway.json` file will configure:
     - Build command: `npm run build`
     - Start command: `npm start`
     - Health check: `GET /api/check`

4. **Deploy**
   - Click "Deploy"
   - Railway will build and deploy automatically
   - Monitor deployment in the Railway dashboard

### Option 2: Manual Railway CLI Deployment

```bash
# If you have Railway CLI access and are logged in:
cd safe-trade-scout
railway login
railway init
railway up
```

## 🔧 Configuration Details

### Railway Settings (already configured)

```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/check",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment Variables

No environment variables are required for basic functionality. The service uses public APIs:
- GoPlus Security API (public endpoints)
- DEXScreener API (public endpoints)

Optional environment variables for higher rate limits:
```
GOPLUS_API_KEY=your_key_here
DEXSCREENER_API_KEY=your_key_here
```

## 🌐 Live Service URLs

After deployment, your service will be available at:
- Railway domain: `https://[your-app-name].up.railway.app`
- API endpoint: `https://[your-app-name].up.railway.app/api/check`

## 🧪 Testing the Deployment

### Health Check
```bash
curl https://[your-app-name].up.railway.app/api/check
```

### API Test
```bash
curl -X POST https://[your-app-name].up.railway.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "token": "0x6B175474E89094C44Da98b954EedeC486C4B7d3fe6f8",
    "chain": "ethereum"
  }'
```

## 📊 Monitoring

Railway provides built-in monitoring:
- **Logs**: View application logs in real-time
- **Metrics**: CPU, memory, network usage
- **Health**: Automatic health checks every 30 seconds
- **Deployments**: Track deployment history

## 🔄 Updates

To deploy updates:
1. Push changes to the `main` branch on GitHub
2. Railway will auto-redeploy (if auto-deploy is enabled)
3. Or manually trigger deployment from Railway dashboard

## 🚨 Troubleshooting

### Build Issues
- Check build logs in Railway dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are installed

### Runtime Issues
- Check application logs for errors
- Verify health check endpoint returns 200
- Monitor memory/CPU usage

### API Issues
- Test individual API endpoints (GoPlus, DEXScreener)
- Check for rate limiting
- Verify token addresses and chain parameters

## 📝 Next Steps After Deployment

1. **Configure Custom Domain** (optional)
   - Add your domain in Railway settings
   - Update DNS records as instructed

2. **Set up Monitoring** (optional)
   - Add error tracking (Sentry, etc.)
   - Set up uptime monitoring

3. **API Keys** (optional)
   - Add GoPlus/DEXScreener API keys for higher rate limits
   - Configure via Railway environment variables

4. **Rate Limiting** (recommended for production)
   - Implement request rate limiting
   - Add API authentication if needed