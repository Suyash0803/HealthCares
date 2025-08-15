# Nginx Configuration for HealthCare Application

This directory contains nginx configuration files for different deployment scenarios of your healthcare application.

## Files Overview

### 1. `nginx.conf`
- **Purpose**: Development setup with reverse proxy
- **Use case**: Local development with Vite dev server
- **Features**:
  - Proxies frontend requests to Vite dev server (port 5173)
  - Proxies API requests to backend server (port 3000)
  - Rate limiting for API endpoints
  - Security headers
  - Static asset caching

### 2. `nginx-production.conf`
- **Purpose**: Production setup serving static files
- **Use case**: Production deployment with built React app
- **Features**:
  - Serves static files directly from nginx
  - Optimized caching strategies
  - HTTPS support (commented out, configure as needed)
  - Enhanced security headers

### 3. `Dockerfile.nginx`
- **Purpose**: Docker container for nginx reverse proxy
- **Use case**: Development/staging environments

### 4. `Dockerfile.production`
- **Purpose**: Multi-stage Docker build for production
- **Use case**: Production deployment with optimized build

## Deployment Options

### Option 1: Development with Docker Compose

```bash
# Use the nginx reverse proxy setup
docker-compose -f docker-compose.nginx.yml up
```

This will:
- Start your React app on port 5173
- Start your backend on port 3000
- Start nginx on port 80 as reverse proxy
- Access your app at http://localhost

### Option 2: Production Deployment

```bash
# Build and deploy production version
docker-compose -f docker-compose.production.yml up
```

This will:
- Build your React app into static files
- Serve static files directly through nginx
- Proxy API calls to backend
- Access your app at http://localhost

### Option 3: Manual nginx Setup

1. **Install nginx** on your server
2. **Copy the appropriate config**:
   ```bash
   # For development
   sudo cp nginx.conf /etc/nginx/nginx.conf
   
   # For production
   sudo cp nginx-production.conf /etc/nginx/nginx.conf
   ```
3. **Test configuration**:
   ```bash
   sudo nginx -t
   ```
4. **Restart nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

## Configuration Customization

### Domain Name
Replace `healthcare.local` with your actual domain name in the configuration files.

### SSL/HTTPS Setup
1. Uncomment the HTTPS server block in the configuration
2. Update paths to your SSL certificates:
   ```nginx
   ssl_certificate /path/to/your/certificate.crt;
   ssl_certificate_key /path/to/your/private.key;
   ```

### Backend API URL
Update the upstream backend configuration if your backend runs on different host/port:
```nginx
upstream backend {
    server your-backend-host:3000;
}
```

### Rate Limiting
Adjust rate limiting based on your needs:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;  # 10 requests per second
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m; # 5 requests per minute for login
```

### File Upload Limits
Modify client_max_body_size for different file upload limits:
```nginx
client_max_body_size 100M;  # For large medical files
```

## Security Features

### Rate Limiting
- API endpoints: 10 requests/second
- Authentication endpoints: 5 requests/minute
- Burst handling with queueing

### Security Headers
- X-Frame-Options: Prevents clickjacking
- X-XSS-Protection: XSS protection
- X-Content-Type-Options: MIME type sniffing protection
- Content-Security-Policy: Controls resource loading

### Access Control
- Blocks access to sensitive files (.env, .git, etc.)
- Dedicated upload handling for medical documents

## Monitoring and Logs

### Log Files
- Access logs: `/var/log/nginx/access.log`
- Error logs: `/var/log/nginx/error.log`

### Health Check
Access `http://your-domain/health` to check if nginx is running.

### Monitoring Commands
```bash
# Check nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# Test configuration
sudo nginx -t

# Reload configuration without downtime
sudo nginx -s reload
```

## Performance Optimizations

### Caching Strategy
- Static assets (JS, CSS, images): 1 year cache
- Video files: 30 days cache
- HTML files: 1 hour cache (for updates)

### Compression
- Gzip compression enabled for text-based files
- Compression level 6 (balance of speed vs. size)

### Connection Handling
- Keep-alive connections enabled
- Optimized buffer sizes for healthcare application needs

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend service is running
   - Verify upstream configuration

2. **413 Request Entity Too Large**
   - Increase `client_max_body_size`
   - Check file upload limits

3. **Rate Limiting Errors**
   - Adjust rate limiting zones
   - Check if legitimate traffic is being blocked

### Debug Commands
```bash
# Test specific configuration
sudo nginx -t -c /path/to/nginx.conf

# Check which processes are using ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000

# Test backend connectivity
curl http://localhost:3000/api/health
```

## Production Checklist

- [ ] Update domain name in configuration
- [ ] Configure SSL certificates
- [ ] Set up proper DNS records
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Configure monitoring
- [ ] Test rate limiting
- [ ] Verify security headers
- [ ] Test file upload functionality
- [ ] Set up backup procedures

## Additional Notes

- The configuration assumes your React app is built into static files for production
- API routes are prefixed with `/api/`
- The setup supports both HTTP and HTTPS (configure SSL as needed)
- Rate limiting is configured for healthcare application security requirements
- File upload limits are set high to accommodate medical documents and reports
