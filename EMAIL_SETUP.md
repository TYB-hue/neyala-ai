# Email Setup Guide

## 📧 Contact Form Email Configuration

All contact form submissions will be sent to: **nyala.trip@gmail.com**

## 🚀 Quick Setup Options

### Option 1: Resend (Recommended - Easiest)
1. Go to [resend.com](https://resend.com)
2. Sign up and get your API key
3. Add to your `.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Option 2: SendGrid
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account and get API key
3. Add to your `.env.local`:
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Option 3: Gmail SMTP
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Add to your `.env.local`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Option 4: Webhook (Zapier/Make.com)
1. Create a Zapier webhook or Make.com scenario
2. Add to your `.env.local`:
```bash
WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/
```

## 📋 Email Content

Each contact form submission will include:
- **Name**: First and last name
- **Email**: User's email (for replies)
- **Phone**: Optional phone number
- **Company**: Optional company name
- **Subject**: Selected subject category
- **Message**: User's message
- **Timestamp**: When submitted

## 🔧 Current Status

**Right now**: Emails are logged to console (for development)
**After setup**: Emails will be sent to nyala.trip@gmail.com

## 🎯 Next Steps

1. Choose an email service from above
2. Add the environment variables
3. Deploy to production
4. Test the contact form

The contact form will work immediately, and emails will be sent to your business email once you configure one of the email services above.


