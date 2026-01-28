# Deployment Guide - Vercel

This guide walks you through deploying the **Prompting Avvocati** application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier available)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally (for testing)

## Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git provider and repository
   - Vercel will auto-detect the Vite framework

3. **Configure Build Settings** (Auto-detected)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - Project name? Press Enter to use default
   - In which directory is your code located? **.**
   - Want to override settings? **N**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

If your application requires environment variables:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables:
   - Variable name (e.g., `VITE_API_KEY`)
   - Value
   - Select environments (Production, Preview, Development)
4. Redeploy for changes to take effect

> [!IMPORTANT]
> Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

## Custom Domain

1. Go to your project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to your main/master branch
- **Preview**: Every push to other branches and pull requests

## Testing Before Deployment

Always test the production build locally before deploying:

```bash
# Build the production bundle
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Troubleshooting

### Build Fails

- Check the build logs in the Vercel dashboard
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Verify Node.js version compatibility

### 404 Errors on Routes

- Ensure `vercel.json` contains the rewrite rules for SPA routing
- Check that `base: '/'` is set in `vite.config.ts`

### Assets Not Loading

- Verify the `base` path in `vite.config.ts` is set to `'/'`
- Check browser console for CORS or path errors
- Ensure assets are in the `public` folder or imported in components

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Redeploy after adding environment variables
- Check that variables are set for the correct environment

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Asset optimization and compression
- ✅ Edge caching for static assets

## Monitoring

Access deployment analytics:
1. Go to your project dashboard
2. Click on **Analytics** tab
3. View performance metrics, visitor stats, and Core Web Vitals

## Rollback

If a deployment has issues:
1. Go to **Deployments** tab
2. Find a previous working deployment
3. Click the three dots menu
4. Select **Promote to Production**

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Your app is now ready for deployment! 🚀**
