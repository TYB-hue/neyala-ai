# 🌐 Subdomain Setup Guide: nyala.my.to

This guide will help you configure your VPS to serve your Next.js application on the subdomain `nyala.my.to`.

## 📋 Prerequisites

- Your VPS IP address: `72.60.108.106` (from previous context)
- Access to your domain DNS settings (where `my.to` is managed)
- SSH access to your VPS
- Nginx installed and running on your VPS

## 🔧 Step 1: Configure DNS Records

You need to add an A record for your subdomain to point to your VPS IP address.

### DNS Configuration

1. **Log in to your domain registrar** (where `my.to` is managed)
2. **Navigate to DNS Management**
3. **Add a new A record:**
   - **Type**: A
   - **Name/Host**: `nyala` (or `nyala.my.to` depending on your DNS provider)
   - **Value/Points to**: `72.60.108.106`
   - **TTL**: 3600 (or default)

### DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate
- You can check propagation status at: https://www.whatsmydns.net/#A/nyala.my.to
- Test locally: `ping nyala.my.to` (should resolve to `72.60.108.106`)

## 🖥️ Step 2: Update Nginx Configuration on VPS

SSH into your VPS and update the Nginx configuration:

```bash
# SSH into your VPS
ssh root@72.60.108.106

# Navigate to Nginx sites-available
cd /etc/nginx/sites-available

# Edit your current site configuration (or create new one)
sudo nano neyala-ai
```

### Nginx Configuration

Update or create the server block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name nyala.my.to www.nyala.my.to;

    # Redirect HTTP to HTTPS (optional but recommended)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nyala.my.to www.nyala.my.to;

    # SSL Certificate paths (will be set up in Step 3)
    ssl_certificate /etc/letsencrypt/live/nyala.my.to/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nyala.my.to/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Increase body size for file uploads
    client_max_body_size 20M;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit** (Ctrl+X, then Y, then Enter)

### Enable the Site

```bash
# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/neyala-ai /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

## 🔒 Step 3: Set Up SSL Certificate (Let's Encrypt)

Install Certbot and get a free SSL certificate:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate for your domain
sudo certbot --nginx -d nyala.my.to -d www.nyala.my.to

# Follow the prompts:
# - Enter your email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Obtain the SSL certificate
- Update your Nginx configuration
- Set up auto-renewal

### Auto-Renewal Test

```bash
# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔄 Step 4: Update Environment Variables

Update your Next.js app environment variables to use the new domain:

```bash
# Navigate to your app directory
cd /var/www/neyala-ai

# Edit .env file
nano .env
```

### Update These Variables:

```bash
# Update the app URL
NEXT_PUBLIC_APP_URL=https://nyala.my.to

# If using Clerk, update allowed origins
# Go to Clerk Dashboard > Settings > Allowed Origins
# Add: https://nyala.my.to
```

### Update Clerk Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Settings** → **Domains**
3. Add `nyala.my.to` to **Allowed Origins**
4. Update **Frontend API** URL if needed

## 🚀 Step 5: Restart Your Application

```bash
# Restart PM2
pm2 restart neyala-ai --update-env

# Check status
pm2 status

# View logs
pm2 logs neyala-ai
```

## ✅ Step 6: Verify Everything Works

1. **Check DNS Resolution:**
   ```bash
   ping nyala.my.to
   # Should resolve to 72.60.108.106
   ```

2. **Test HTTP (should redirect to HTTPS):**
   ```bash
   curl -I http://nyala.my.to
   # Should return 301 redirect
   ```

3. **Test HTTPS:**
   ```bash
   curl -I https://nyala.my.to
   # Should return 200 OK
   ```

4. **Visit in Browser:**
   - Open `https://nyala.my.to` in your browser
   - Check for SSL certificate (padlock icon)
   - Verify the site loads correctly

## 🐛 Troubleshooting

### DNS Not Resolving

```bash
# Check DNS propagation
dig nyala.my.to
nslookup nyala.my.to

# If not resolving, wait for DNS propagation (up to 48 hours)
```

### Nginx Errors

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check certificate expiration
sudo certbot certificates | grep Expiry
```

### Application Not Loading

```bash
# Check if Next.js app is running
pm2 status

# Check app logs
pm2 logs neyala-ai --lines 50

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000
```

## 📝 Additional Configuration

### Update Sitemap (if needed)

If you have a sitemap, update it to use the new domain:

```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nyala.my.to',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // ... other URLs
  ]
}
```

### Update Robots.txt (if needed)

```typescript
// src/app/robots.txt/route.ts
export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://nyala.my.to/sitemap.xml`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
```

## 🎯 Summary

After completing these steps:

1. ✅ DNS A record points `nyala.my.to` → `72.60.108.106`
2. ✅ Nginx configured to serve the domain
3. ✅ SSL certificate installed (HTTPS enabled)
4. ✅ Environment variables updated
5. ✅ Application restarted

Your site should now be accessible at **https://nyala.my.to**!

## 📞 Need Help?

If you encounter issues:
1. Check DNS propagation: https://www.whatsmydns.net/#A/nyala.my.to
2. Verify Nginx configuration: `sudo nginx -t`
3. Check application logs: `pm2 logs neyala-ai`
4. Review Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

