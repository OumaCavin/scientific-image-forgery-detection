# Deployment Guide
# Author: Cavin Otieno

## Overview

This guide provides comprehensive instructions for deploying the Scientific Image Forgery Detection System to various cloud platforms. The system is designed to be cloud-native and scalable.

## Prerequisites

- Docker and Docker Compose installed
- Git repository access
- Cloud platform accounts (AWS, GCP, Azure, or Vercel)
- Domain name and SSL certificate (for production)

## Local Development Deployment

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/OumaCavin/scientific-image-forgery-detection.git
   cd scientific-image-forgery-detection
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your configurations
   ```

3. **Start the development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Production Deployment Options

### Option 1: Vercel + Supabase (Recommended for Frontend)

#### Frontend Deployment to Vercel

**Current Status:** ✅ Successfully deployed at https://scientific-image-forgery-detection.vercel.app/

1. **Connect to Vercel**
   - Repository automatically connected via GitHub integration
   - Vercel handles TypeScript compilation and Vite builds
   - Environment variables configured in Vercel dashboard

2. **Key Configuration Files**
   ```json
   // vercel.json (root directory)
   {
     "outputDirectory": "frontend/dist"
   }
   ```

   ```typescript
   // frontend/vite-env.d.ts
   /// <reference types="vite/client" />
   interface ImportMetaEnv {
     readonly VITE_API_URL: string
     readonly VITE_SUPABASE_URL: string
     readonly VITE_SUPABASE_ANON_KEY: string
   }
   interface ImportMeta {
     readonly env: ImportMetaEnv
   }
   ```

3. **Environment Variables in Vercel**
   ```env
   VITE_API_URL=https://your-api-url.com/api/v1
   VITE_SUPABASE_URL=https://ygcnkooxairnavbrqblq.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_APP_NAME="Scientific Image Forgery Detection"
   VITE_APP_VERSION="1.0.0"
   ```

4. **Build Process (Updated)**
   ```bash
   # Automated by Vercel - builds only frontend for static deployment
   npm run build  # Runs: npm run build:frontend (removed backend build)
   
   # Manual build for testing
   cd frontend
   npm run build  # TypeScript compilation + Vite build
   ```

5. **Deployment Commands**
   ```bash
   # Automatic deployment via GitHub integration
   git push origin main  # Triggers Vercel deployment
   
   # Manual deployment
   vercel --prod
   ```

**Recent Build Fixes:**
- ✅ Resolved 22+ TypeScript compilation errors
- ✅ Fixed React Query v5 API changes (cacheTime → gcTime)
- ✅ Added recharts dependency for data visualization
- ✅ Created TypeScript declarations for Vite environment variables
- ✅ Optimized build script for Vercel (frontend-only)
- ✅ Configured proper output directory for Vercel builds

#### Backend Deployment to Cloud Run

1. **Build and push Docker image**
   ```bash
   # Build the image
   docker build -t scientific-image-forgery-detection .
   
   # Tag for registry
   docker tag scientific-image-forgery-detection gcr.io/YOUR_PROJECT/scientific-image-forgery-detection
   
   # Push to Google Container Registry
   docker push gcr.io/YOUR_PROJECT/scientific-image-forgery-detection
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy scientific-image-api \
     --image gcr.io/YOUR_PROJECT/scientific-image-forgery-detection \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8000 \
     --memory 2Gi \
     --cpu 2 \
     --concurrency 10 \
     --max-instances 10 \
     --set-env-vars ENVIRONMENT=production,SECRET_KEY=your-secret-key
   ```

### Option 2: AWS Deployment

#### Frontend to S3 + CloudFront

1. **Build and upload frontend**
   ```bash
   cd frontend
   npm run build
   
   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **Create CloudFront distribution**
   ```bash
   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
   ```

#### Backend to ECS/Fargate

1. **Create ECS task definition**
   ```json
   {
     "family": "scientific-image-api",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "2048",
     "memory": "4096",
     "containerDefinitions": [
       {
         "name": "api",
         "image": "your-ecr-repo/scientific-image-forgery-detection:latest",
         "portMappings": [
           {
             "containerPort": 8000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "ENVIRONMENT",
             "value": "production"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/scientific-image-api",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

2. **Deploy with Terraform**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### Option 3: Azure Deployment

#### Frontend to Static Web Apps

1. **Configure Azure Static Web Apps**
   ```yaml
   name: scientific-image-forgery-detection
   on:
     push:
       branches:
         - main
   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       name: Build and Deploy Job
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install dependencies
           run: |
             cd frontend
             npm install
         - name: Build
           run: |
             cd frontend
             npm run build
         - name: Deploy to Azure
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "frontend"
             output_location: "dist"
   ```

#### Backend to Container Apps

1. **Deploy with Azure CLI**
   ```bash
   # Create resource group
   az group create --name rg-scientific-image --location eastus
   
   # Create container app
   az containerapp create \
     --name scientific-image-api \
     --resource-group rg-scientific-image \
     --environment cae-scientific-image-env \
     --image your-registry.azurecr.io/scientific-image-forgery-detection:latest \
     --target-port 8000 \
     --cpu 2.0 \
     --memory 4.0 \
     --min-replicas 1 \
     --max-replicas 10
   ```

### Option 4: DigitalOcean Deployment

1. **Create DigitalOcean App**
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

2. **App specification (.do/app.yaml)**
   ```yaml
   name: scientific-image-forgery-detection
   services:
   - name: api
     source_dir: /
     github:
       repo: OumaCavin/scientific-image-forgery-detection
       branch: main
       deploy_on_push: true
     dockerfile_path: Dockerfile
     run_command: python backend/main.py
     environment_slug: python
     instance_count: 1
     instance_size_slug: professional-xs
     envs:
     - key: ENVIRONMENT
       value: production
     - key: SUPABASE_URL
       value: ${SUPABASE_URL}
     - key: SUPABASE_ANON_KEY
       value: ${SUPABASE_ANON_KEY}
   - name: frontend
     source_dir: /
     github:
       repo: OumaCavin/scientific-image-forgery-detection
       branch: main
       deploy_on_push: true
     build_command: cd frontend && npm install && npm run build
     run_command: cd frontend && npx serve -s dist -l 3000
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: professional-xs
     envs:
     - key: VITE_API_URL
       value: ${API_URL}
     - key: VITE_SUPABASE_URL
       value: ${SUPABASE_URL}
     - key: VITE_SUPABASE_ANON_KEY
       value: ${SUPABASE_ANON_KEY}
   ```

## Database Configuration

### Supabase Setup

1. **Create Supabase project**
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Note the project URL and API keys

2. **Configure environment variables**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run database migrations**
   ```bash
   cd backend
   python scripts/init_db.py
   python scripts/migrate.py
   ```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Monitoring and Logging

### Application Monitoring

1. **Prometheus configuration**
   ```yaml
   global:
     scrape_interval: 15s
   scrape_configs:
   - job_name: 'scientific-image-api'
     static_configs:
     - targets: ['api:8000']
   ```

2. **Grafana dashboard**
   - Import dashboard ID: [scientific-image-dashboard.json](./dashboards/scientific-image-dashboard.json)

### Error Tracking

1. **Sentry integration**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.fastapi import FastApiIntegration
   from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
   
   sentry_sdk.init(
       dsn="YOUR_SENTRY_DSN",
       integrations=[
           FastApiIntegration(auto_enabling=True),
           SqlalchemyIntegration(),
       ],
       traces_sample_rate=1.0
   )
   ```

## Performance Optimization

### CDN Configuration

1. **CloudFlare setup**
   - Add your domain to CloudFlare
   - Enable caching and compression
   - Configure image optimization

2. **Cache headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

### Auto-scaling

1. **Kubernetes HPA**
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: scientific-image-api-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: scientific-image-api
     minReplicas: 1
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   ```

## Security Considerations

1. **Environment variables**: Never commit secrets to version control
2. **Network security**: Use VPC and security groups
3. **API rate limiting**: Implement rate limiting for API endpoints
4. **Input validation**: Validate all user inputs
5. **CORS configuration**: Restrict CORS origins for production

## Backup and Recovery

### Database Backups

1. **Automated Supabase backups**
   - Enable automatic daily backups
   - Test restore procedures

2. **File storage backups**
   ```bash
   # Backup uploaded files
   aws s3 sync s3://your-bucket/uploads/ s3://your-backup-bucket/uploads/
   ```

### Disaster Recovery

1. **Multi-region deployment**
   - Deploy to multiple regions
   - Use global load balancers

2. **Database replication**
   - Enable read replicas
   - Configure automatic failover

## TypeScript Compilation & Build Configuration

### Recent TypeScript Fixes

**Issues Resolved:**
1. **Unused Variables/Imports (TS6133)**: Removed 10+ unused imports across multiple files
2. **API Changes (TS2353)**: Updated React Query from `cacheTime` to `gcTime` for v5 compatibility
3. **Missing Dependencies (TS2307)**: Added `recharts@^2.8.0` for data visualization
4. **Environment Variables (TS2339)**: Created `vite-env.d.ts` for TypeScript declarations
5. **Property Naming (TS2551)**: Fixed `image_size` → `imageSize` consistency
6. **Type Annotations (TS7031)**: Added explicit types for destructured parameters
7. **Component Props (TS2345/TS2352)**: Fixed type assignments in AnalyzePage component

**Files Modified:**
- `frontend/src/App.tsx`: Fixed React Query v5 API, removed unused imports
- `frontend/src/pages/AboutPage.tsx`: Removed unused icon imports
- `frontend/src/pages/HomePage.tsx`: Removed unused icon imports
- `frontend/src/pages/StatisticsPage.tsx`: Fixed chart imports, property names, and typing
- `frontend/src/pages/AnalyzePage.tsx`: Fixed component prop types and unused parameters
- `frontend/package.json`: Added recharts dependency
- `frontend/src/vite-env.d.ts`: NEW - TypeScript declarations for Vite
- `vercel.json`: NEW - Vercel output directory configuration
- `package.json`: Updated build script for frontend-only deployment

### Build Configuration

**TypeScript Configuration:**
- Strict mode enabled for better type safety
- Composite project configuration for efficient builds
- Source maps enabled for debugging

**Vite Configuration:**
- TypeScript compilation integrated with Vite
- Asset bundling and optimization
- Development server on port 3000

**Build Process:**
```bash
# Development
npm run dev              # Start development server
npm run build:frontend   # TypeScript + Vite build

# Production
npm run build            # Runs only frontend build for Vercel
cd frontend && npm run build
```

## Troubleshooting

### Common Issues

1. **High memory usage**
   - Monitor Docker container memory
   - Adjust container memory limits
   - Optimize model inference

2. **Slow API responses**
   - Enable request caching
   - Optimize database queries
   - Use CDN for static assets

3. **Failed deployments**
   - Check Docker image size
   - Verify environment variables
   - Review deployment logs

### TypeScript Compilation Issues

**TS6133 (Unused Variables):**
```bash
# Fix: Remove unused variables or prefix with underscore
# Before: index, React, Database, BookOpen, etc.
// After: _index, removed unused imports
```

**TS2353 (Cache Time):**
```typescript
// Fix: Update React Query v5 API
// Before: cacheTime: 10 * 60 * 1000
// After:  gcTime: 10 * 60 * 1000
```

**TS2339 (ImportMeta):**
```typescript
// Fix: Create vite-env.d.ts with declarations
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}
```

**TS2307 (Missing Module):**
```bash
# Fix: Install missing dependency
npm install recharts@^2.8.0
```

**Build Directory Issues:**
```json
// Fix: Add vercel.json for output directory
{
  "outputDirectory": "frontend/dist"
}
```

### Vercel-Specific Issues

1. **"No Output Directory found"**
   - Solution: Add `vercel.json` with correct `outputDirectory`
   - Check build logs for actual build location

2. **TypeScript compilation failures**
   - Solution: Review build log for specific error codes
   - Update dependencies for compatibility
   - Ensure all unused variables are removed

3. **Environment variables not loading**
   - Solution: Prefix with `VITE_` for Vite builds
   - Configure in Vercel dashboard environment variables section

### Performance Optimization

1. **Bundle size optimization**
   ```bash
   # Analyze bundle size
   npm run build:frontend
   npm install -g webpack-bundle-analyzer
   npx webpack-bundle-analyzer dist/assets/*.js
   ```

2. **Code splitting**
   ```typescript
   // Use dynamic imports for large components
   const StatisticsPage = lazy(() => import('./pages/StatisticsPage'))
   ```

3. **Image optimization**
   - Use WebP format for better compression
   - Implement lazy loading for large datasets
   - Optimize chart library usage

### Logs Analysis

```bash
# View application logs
docker-compose logs -f api

# Monitor system resources
docker stats

# Check database connections
docker-compose exec db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Vercel build logs
vercel logs --follow

# Check TypeScript compilation
cd frontend && npx tsc --noEmit
```

## Cost Optimization

1. **Right-sizing instances**: Choose appropriate instance sizes
2. **Auto-scaling**: Scale down during low traffic
3. **Reserved instances**: Use for predictable workloads
4. **Storage optimization**: Use appropriate storage classes
5. **CDN caching**: Reduce bandwidth costs

## Support and Maintenance

- Monitor application health and performance
- Keep dependencies updated
- Review security patches
- Monitor cloud provider billing
- Set up alerting for critical issues

For additional support, refer to the [project documentation](./README.md) or contact the development team.
