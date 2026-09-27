"use client";

import dynamic from 'next/dynamic';
import React, { Component, useMemo, useEffect, useState } from 'react';

interface MapProps {
  center: { lat: number; lng: number };
  markers?: Array<{ position: { lat: number; lng: number }; title: string; type: string; photoUrl?: string }>;
}
const GoogleMap = dynamic(() => import('./MapComponent'), { ssr: false });
const FallbackMap = dynamic(() => import('./SimpleMap'), { ssr: false });
class MapBoundary extends Component<React.PropsWithChildren<{ fallback: React.ReactNode }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export default function Map({ center, markers = [] }: MapProps) {
  const [unavailable, setUnavailable] = useState(!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  useEffect(() => {
    const target = window as Window & { gm_authFailure?: () => void };
    const previous = target.gm_authFailure;
    const fail = () => setUnavailable(true);
    target.gm_authFailure = fail;
    return () => { if (target.gm_authFailure === fail) target.gm_authFailure = previous; };
  }, []);
  const places = useMemo(() => markers.filter(m => Number.isFinite(m.position?.lat) && Number.isFinite(m.position?.lng))
    .map(m => ({ ...m.position, name: m.title, type: m.type, photoUrl: m.photoUrl })), [markers]);
  if (unavailable) return <FallbackMap center={center} markers={markers} />;
  return <MapBoundary fallback={<FallbackMap center={center} markers={markers} />}>
    <GoogleMap center={center} places={places} onUnavailable={() => setUnavailable(true)} />
  </MapBoundary>;
}
