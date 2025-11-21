# Google Maps Integration Setup

Your website has been updated to use Google Maps instead of Leaflet/OpenStreetMap.

## What Changed

1. **MapComponent.tsx**: Replaced Leaflet implementation with Google Maps JavaScript API
2. **SimpleMap.tsx**: Updated to use the new Google Maps API key from environment variables
3. **API Key**: Added to environment variables

## API Key Configuration

### Local Development (.env.local)

Add the Google Maps API key to your `.env.local` file:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**⚠️ IMPORTANT: Never commit API keys to Git!** The `.env.local` file is already in `.gitignore`.

### VPS Production (.env)

Add the API key to your VPS `.env` file:

```bash
# SSH into your VPS
ssh root@72.60.108.106

# Navigate to project directory
cd /var/www/neyala-ai

# Edit .env file
nano .env

# Add this line (replace with your actual API key):
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE

# Save and exit (Ctrl+X, Y, Enter)

# Restart the application
pm2 restart neyala-ai --update-env
```

## Features

The new Google Maps implementation includes:

- ✅ Interactive Google Maps with full controls
- ✅ Custom markers for activities (green) and hotels (blue)
- ✅ Info windows showing location details
- ✅ Automatic bounds fitting to show all markers
- ✅ Smooth loading with proper error handling
- ✅ Fallback to embed map if JavaScript API fails

## API Key Requirements

Make sure your Google Maps API key has the following APIs enabled:

1. **Maps JavaScript API** - Required for the interactive map
2. **Maps Embed API** - Required for the fallback embed map (optional but recommended)

### Enable APIs in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Library**
4. Search for and enable:
   - **Maps JavaScript API**
   - **Maps Embed API** (for fallback)

### API Key Restrictions (Recommended)

For security, restrict your API key:

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**, select:
   - **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://nyala.my.to/*` (for production)
     - `https://72.60.108.106/*` (if using IP)
4. Under **API restrictions**, select:
   - **Restrict key**
   - Enable only:
     - Maps JavaScript API
     - Maps Embed API

## Testing

After deployment, test the map:

1. Visit an itinerary page with locations
2. The map should load with Google Maps styling
3. Click on markers to see info windows
4. Verify markers are colored correctly (green for activities, blue for hotels)

## Troubleshooting

### Map Not Loading

1. **Check API Key**: Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
2. **Check Browser Console**: Look for Google Maps API errors
3. **Verify API Enabled**: Ensure Maps JavaScript API is enabled in Google Cloud Console
4. **Check API Key Restrictions**: Make sure your domain is allowed

### Common Errors

- **"This page can't load Google Maps correctly"**: API key issue or domain not allowed
- **"RefererNotAllowedMapError"**: Domain restriction issue - add your domain to allowed referrers
- **"ApiNotActivatedMapError"**: Maps JavaScript API not enabled

## Migration Notes

- The map interface remains the same, so no changes needed in components using the Map component
- Leaflet dependencies can be removed from package.json if desired (but kept for now for backward compatibility)
- The map will automatically fall back to embed map if JavaScript API fails

## Next Steps

1. Deploy to VPS and add the API key to `.env`
2. Test the map on your production site
3. Verify all markers display correctly
4. Consider removing Leaflet dependencies if everything works well
