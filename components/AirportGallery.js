'use client';

import React, { useEffect, useState } from 'react';
import { getAirportPhotos } from '@/../lib/wikimedia';

export default function AirportGallery({ airportName }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!airportName) return;
      setLoading(true);
      try {
        const urls = await getAirportPhotos(airportName, 5);
        if (!cancelled) setPhotos(urls);
      } catch {
        if (!cancelled) setPhotos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [airportName]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{airportName}</h3>
      {loading && (
        <div className="text-gray-500 text-sm">Loading photos...</div>
      )}
      <div className="flex flex-wrap gap-3">
        {photos.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={`${airportName} ${idx + 1}`}
            style={{ width: 200, height: 'auto', borderRadius: 8, objectFit: 'cover' }}
          />
        ))}
        {!loading && photos.length === 0 && (
          <div className="text-gray-500 text-sm">No images found.</div>
        )}
      </div>
    </div>
  );
}




