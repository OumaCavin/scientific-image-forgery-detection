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

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Set environment variables in Vercel**
   ```env
   VITE_API_URL=https://your-api-url.com/api/v1
   VITE_SUPABASE_URL=https://ygcnkooxairnavbrqblq.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_APP_NAME="Scientific Image Forgery Detection"
   VITE_APP_VERSION="1.0.0"
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

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

### Logs Analysis

```bash
# View application logs
docker-compose logs -f api

# Monitor system resources
docker stats

# Check database connections
docker-compose exec db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
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
