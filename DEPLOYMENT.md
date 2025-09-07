# NicheConnect Deployment Guide 🚀

This guide covers deploying NicheConnect to production environments, with specific focus on Base Mini App deployment.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- OnchainKit API key for Base integration
- OpenAI API key for AI features
- Vercel account (recommended) or other hosting platform

## Environment Setup

### 1. Supabase Configuration

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `lib/database-schema.sql`
   - Execute the SQL to create all tables, indexes, and policies

3. **Configure Authentication**
   - Enable email authentication in Supabase Auth settings
   - Configure any additional auth providers if needed
   - Set up redirect URLs for your domain

### 2. OnchainKit Setup

1. **Get OnchainKit API Key**
   - Visit [OnchainKit documentation](https://onchainkit.xyz)
   - Create an account and generate an API key
   - This is required for Base Mini App functionality

### 3. OpenAI Configuration

1. **Get OpenAI API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an API key with appropriate permissions
   - This powers the AI matching features

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications and Base Mini Apps.

#### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

#### Step 2: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```env
# Required Variables
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=NicheConnect
NODE_ENV=production
```

#### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

#### Step 4: Custom Domain (Optional)

1. Go to Settings > Domains in Vercel
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Option 2: Manual Deployment

For other hosting platforms or self-hosting:

#### Step 1: Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start the production server
npm start
```

#### Step 2: Environment Variables

Set the following environment variables on your hosting platform:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=NicheConnect
NODE_ENV=production
```

## Base Mini App Configuration

### 1. Register Your Mini App

1. Go to the Base Mini App registry
2. Submit your application with:
   - App name: NicheConnect
   - Description: Your curated launchpad for student entrepreneur success
   - URL: Your deployed app URL
   - Category: Social/Education

### 2. Configure Mini App Metadata

Ensure your `app/layout.tsx` includes proper metadata:

```tsx
export const metadata = {
  title: 'NicheConnect - Student Entrepreneur Hub',
  description: 'Your curated launchpad for student entrepreneur success',
  openGraph: {
    title: 'NicheConnect',
    description: 'Connect with fellow student entrepreneurs',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'NicheConnect',
  },
}
```

### 3. Test Mini App Integration

1. Test wallet connection functionality
2. Verify OnchainKit components work correctly
3. Test in Base wallet or compatible Mini App browser

## Database Migration

### Initial Setup

Run the database schema on your production Supabase instance:

```sql
-- Copy and paste contents of lib/database-schema.sql
-- This creates all tables, indexes, RLS policies, and sample data
```

### Row Level Security (RLS)

Ensure RLS policies are properly configured:

1. Users can only edit their own profiles
2. Connections are visible to involved parties only
3. Feedback sessions respect privacy settings
4. Submissions are private to the user

## Security Checklist

### Environment Variables
- [ ] All sensitive keys are in environment variables
- [ ] No hardcoded secrets in code
- [ ] Production URLs are configured correctly

### Database Security
- [ ] Row Level Security (RLS) is enabled
- [ ] Proper authentication policies are in place
- [ ] Database backups are configured

### Application Security
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Rate limiting is in place (if needed)

## Performance Optimization

### 1. Next.js Optimizations

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
  },
  // Enable compression
  compress: true,
  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig
```

### 2. Database Optimizations

- Indexes are already configured in the schema
- Consider connection pooling for high traffic
- Monitor query performance in Supabase dashboard

### 3. Caching Strategy

- Static assets are cached by Vercel/CDN
- API responses can be cached with appropriate headers
- Consider Redis for session caching if needed

## Monitoring and Analytics

### 1. Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`:

```javascript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 2. Analytics

Add Google Analytics or similar:

```javascript
// In app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
```

### 3. Performance Monitoring

- Use Vercel Analytics for performance insights
- Monitor Supabase dashboard for database performance
- Set up uptime monitoring

## Backup and Recovery

### Database Backups

1. Enable automatic backups in Supabase
2. Consider point-in-time recovery
3. Test backup restoration process

### Code Backups

1. Ensure code is in version control (Git)
2. Tag releases for easy rollback
3. Document deployment process

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure database is accessible

3. **OnchainKit Issues**
   - Verify API key is correct
   - Check Base network configuration
   - Test wallet connection

### Debug Mode

Enable debug logging in development:

```env
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## Scaling Considerations

### Traffic Growth

- Vercel automatically scales
- Monitor Supabase usage limits
- Consider CDN for static assets

### Database Scaling

- Monitor connection limits
- Consider read replicas for heavy read workloads
- Optimize queries as data grows

### Cost Optimization

- Monitor Supabase usage
- Optimize API calls
- Use appropriate caching strategies

## Support and Maintenance

### Regular Tasks

- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Backup verification

### Updates

1. Test updates in staging environment
2. Use feature flags for gradual rollouts
3. Monitor after deployments
4. Have rollback plan ready

---

## Quick Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] OnchainKit API key obtained
- [ ] OpenAI API key configured
- [ ] Application deployed to hosting platform
- [ ] Custom domain configured (if applicable)
- [ ] Base Mini App registered
- [ ] Security checklist completed
- [ ] Monitoring configured
- [ ] Backup strategy implemented

**Your NicheConnect app is now ready for production! 🎉**
