#!/usr/bin/env python3
"""
Simple script to get real Booking.com images manually
Run this in non-headless mode to solve captcha manually
"""

import json
import sys
from hotel_scraper_manual import scrape_hotels_manual

def main():
    if len(sys.argv) < 2:
        print("Usage: python get_real_images.py <location>")
        print("Example: python get_real_images.py 'New York'")
        sys.exit(1)
    
    location = sys.argv[1]
    
    print(f"Getting real Booking.com images for: {location}")
    print("A browser window will open. If you see a captcha, solve it manually.")
    print("After solving captcha, press Enter in this terminal.")
    
    # Run in manual mode (non-headless)
    hotels = scrape_hotels_manual(location, max_hotels=5, headless=False)
    
    print(f"\nFound {len(hotels)} hotels with real images:")
    
    for i, hotel in enumerate(hotels, 1):
        print(f"\n{i}. {hotel['name']}")
        print(f"   Price: ${hotel['price']}")
        print(f"   Rating: {hotel['rating']}")
        print(f"   Images: {len(hotel['images'])}")
        
        # Check if images are real Booking.com images
        booking_images = [img for img in hotel['images'] if 'cf.bstatic.com' in img]
        if booking_images:
            print(f"   ✓ Real Booking.com images: {len(booking_images)}")
            for img in booking_images[:2]:  # Show first 2 images
                print(f"      {img}")
        else:
            print(f"   - Fallback images (no real Booking.com images found)")
            for img in hotel['images'][:2]:  # Show first 2 images
                print(f"      {img}")
    
    # Save to file
    output_file = f"real_hotels_{location.replace(' ', '_').replace(',', '')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(hotels, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults saved to: {output_file}")

if __name__ == "__main__":
    main()
