# Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) to track your website visitors.

## Quick Setup

### 1. Create Google Analytics Account

1. Visit [Google Analytics](https://analytics.google.com)
2. Click **"Start measuring"** or **"Get started"**
3. Create an account:
   - Account name: `Nyala` (or your preferred name)
   - Click **"Next"**
4. Set up a property:
   - Property name: `Nyala Website` (or your domain name)
   - Reporting time zone: Choose your timezone
   - Currency: Choose your currency
   - Click **"Next"**
5. Business information (optional):
   - Select your industry
   - Business size
   - How you want to use Analytics
   - Click **"Create"**
6. Accept the terms of service

### 2. Get Your Measurement ID

1. After creating your property, you'll see a **Data Stream** setup
2. Select **"Web"** platform
3. Enter your website URL (e.g., `https://nyala.my.to` or your domain)
4. Stream name: `Nyala Web` (or your preferred name)
5. Click **"Create stream"**
6. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
   - **Copy this ID!**

### 3. Add Measurement ID to Your Environment

#### On Local Development:

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add the following line:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

#### On VPS (Production):

1. SSH into your VPS:
   ```bash
   ssh root@72.60.108.106
   ```

2. Navigate to your project directory:
   ```bash
   cd /var/www/neyala-ai
   ```

3. Edit your `.env` file:
   ```bash
   nano .env
   ```

4. Add the Measurement ID:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. Save and exit (Ctrl+X, then Y, then Enter)

6. Restart your application:
   ```bash
   pm2 restart neyala-ai --update-env
   ```

### 4. Verify Tracking is Working

1. Visit your website
2. Open Google Analytics
3. Go to **Reports** → **Realtime**
4. You should see your visit appear within seconds

## Viewing Your Analytics

### Access Analytics Dashboard

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property
3. Navigate to **Reports** to see:
   - **Realtime**: Current visitors (live)
   - **Acquisition**: Where visitors come from
   - **Engagement**: What pages they visit
   - **Monetization**: Revenue and conversions (if set up)
   - **Retention**: Returning visitors
   - **Demographics**: Visitor location, age, interests
   - **Technology**: Devices, browsers, operating systems

### Key Metrics to Track

- **Users**: Total number of visitors
- **Sessions**: Total visits
- **Page views**: Total pages viewed
- **Bounce rate**: Percentage of single-page visits
- **Session duration**: Average time on site
- **Pages per session**: Average pages per visit
- **Traffic sources**: Where visitors come from (search, direct, social, etc.)

## Access Analytics from Your Website

You can access the analytics page from your profile:
- Go to `/profile/analytics` or click **"Analytics"** in your profile sidebar
- This page provides links and instructions for viewing your analytics

## Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable**
   - Make sure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
   - Variable must start with `NEXT_PUBLIC_` to be accessible in the browser

2. **Verify Measurement ID Format**
   - Should start with `G-` (e.g., `G-XXXXXXXXXX`)
   - Not `UA-` (that's Universal Analytics, which is deprecated)

3. **Clear Browser Cache**
   - Analytics script might be cached
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

4. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any errors related to Google Analytics

5. **Use Google Tag Assistant**
   - Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
   - Visit your website and check if the tag is firing correctly

6. **Wait 24-48 Hours**
   - Full reports may take up to 24 hours to populate
   - Realtime data should appear immediately

## Privacy & GDPR Compliance

Google Analytics collects visitor data. To comply with GDPR:
- Add a cookie consent banner to your website
- Update your privacy policy to mention Google Analytics
- Consider using Google Analytics with IP anonymization (enabled by default in GA4)

## Alternative Analytics Solutions

If you prefer privacy-friendly alternatives:

- **Plausible Analytics** - Privacy-focused, GDPR compliant
- **Umami** - Open-source, self-hosted
- **Posthog** - Product analytics with user tracking

## Next Steps

Once analytics is set up:
1. Set up conversion events (button clicks, form submissions)
2. Create custom reports for your specific needs
3. Set up email reports for weekly/monthly summaries
4. Integrate with Google Search Console for SEO insights
