"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SimpleMapProps {
  center: { lat: number; lng: number };
  markers?: Array<{ position: { lat: number; lng: number }; title: string; type: string }>;
}
export default function SimpleMap({ center, markers = [] }: SimpleMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const fitted = useRef(false);
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current).setView([center.lat, center.lng], 12);
    mapRef.current = map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; layerRef.current = null; fitted.current = false; };
  }, [center.lat, center.lng]);
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const valid = markers.filter(m => Number.isFinite(m.position?.lat) && Number.isFinite(m.position?.lng));
    valid.forEach(m => {
      const label = document.createElement('span');
      label.textContent = m.title;
      L.circleMarker([m.position.lat, m.position.lng], {
        radius: 8, color: '#ffffff', weight: 2, fillColor: m.type === 'hotel' ? '#2563eb' : '#e85d3f', fillOpacity: 1,
      }).bindPopup(label).addTo(layer);
    });
    if (valid.length && !fitted.current) {
      map.fitBounds(L.latLngBounds(valid.map(m => [m.position.lat, m.position.lng])), { padding: [35, 35], maxZoom: 14 });
      fitted.current = true;
    }
  }, [markers, center.lat, center.lng]);
  return <div ref={container} aria-label="Itinerary map" className="relative z-0 h-full w-full min-h-64 rounded-lg" />;
}
