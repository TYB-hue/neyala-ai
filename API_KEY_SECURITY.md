# API Key Security - URGENT ACTION REQUIRED

## ⚠️ Security Alert

Your Google Maps API key was exposed in a public GitHub repository. **Immediate action is required.**

## Steps to Secure Your API Key

### 1. Regenerate the Compromised API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your API key: `AIzaSyDo4ODAVsPRAFmzS7BjX4-NAeqFUpaA1YQ`
4. Click on the key to edit it
5. Click **"Regenerate key"** button
6. Copy the new API key

### 2. Update Environment Variables

#### Local Development (.env.local)
```bash
# Update your .env.local file
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
```

#### VPS Production (.env)
```bash
ssh root@72.60.108.106
cd /var/www/neyala-ai
nano .env
# Update the line:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
# Save and restart
pm2 restart neyala-ai --update-env
```

### 3. Add API Key Restrictions (CRITICAL)

**Application Restrictions:**
1. In Google Cloud Console, edit your API key
2. Under **Application restrictions**, select **HTTP referrers (web sites)**
3. Add your allowed domains:
   - `http://localhost:3000/*` (development)
   - `https://nyala.my.to/*` (production)
   - `https://72.60.108.106/*` (if using IP)
4. Click **Save**

**API Restrictions:**
1. Under **API restrictions**, select **Restrict key**
2. Enable only these APIs:
   - ✅ Maps JavaScript API
   - ✅ Maps Embed API (for fallback)
3. Click **Save**

### 4. Monitor Usage

1. Go to **APIs & Services** → **Dashboard**
2. Monitor API usage for unexpected activity
3. Set up billing alerts if needed

### 5. Review Billing

1. Go to **Billing** → **Reports**
2. Check for any unexpected charges
3. Set up budget alerts

## What Was Fixed

✅ Removed hardcoded API key from `SimpleMap.tsx`
✅ Removed API key from documentation files
✅ All API keys now only use environment variables
✅ Code updated to fail gracefully if key is missing

## Prevention Best Practices

1. **Never commit API keys to Git**
   - ✅ `.env.local` is in `.gitignore` (safe)
   - ✅ `.env` should be in `.gitignore` (check this)
   - ❌ Never hardcode keys in source files

2. **Use Environment Variables Only**
   - All API keys should come from environment variables
   - No fallback values with real keys

3. **Add Restrictions**
   - Always restrict API keys by domain/IP
   - Always restrict by API usage
   - Use separate keys for dev/prod if possible

4. **Regular Audits**
   - Review your GitHub repository for exposed keys
   - Use tools like `git-secrets` or `truffleHog`
   - Monitor Google Cloud Console for unusual activity

## Verify .gitignore

Make sure these files are in your `.gitignore`:
```
.env
.env.local
.env*.local
*.key
*.pem
```

## Check for Other Exposed Keys

Run this command to check your Git history:
```bash
git log --all --full-history --source -- "*API*" "*KEY*" "*SECRET*"
```

If you find other exposed keys, regenerate them immediately.

## Next Steps

1. ✅ Regenerate the compromised API key
2. ✅ Add the new key to environment variables (local + VPS)
3. ✅ Add API key restrictions
4. ✅ Monitor usage for 24-48 hours
5. ✅ Review billing

## Need Help?

- [Google Cloud Security Best Practices](https://cloud.google.com/docs/security)
- [Handling Compromised Credentials](https://cloud.google.com/docs/security/best-practices)
- [API Key Restrictions Guide](https://cloud.google.com/docs/authentication/api-keys#restricting_apis)
