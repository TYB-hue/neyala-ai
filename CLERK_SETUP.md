# Clerk Authentication Setup

## Overview
This project uses Clerk for user authentication. The profile page and other protected features require proper Clerk configuration.

## Setup Steps

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys
1. In your Clerk dashboard, go to API Keys
2. Copy your Publishable Key and Secret Key

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile
```

### 4. Restart the Development Server
```bash
npm run dev
```

## Current Status
- ✅ Sign-in page created (`/sign-in`)
- ✅ Sign-up page created (`/sign-up`)
- ✅ Profile page with fallback for testing
- ✅ Clerk provider configured in layout
- ⚠️ Environment variables need to be configured

## Testing
Currently, the profile page shows a demo user profile when Clerk is not configured. Once you set up the environment variables, it will use real authentication.

## Features
- User authentication with Clerk
- Profile management
- Trip history
- Saved itineraries
- Hotel bookings
- User preferences








