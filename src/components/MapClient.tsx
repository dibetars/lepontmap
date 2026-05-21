'use client';

import { useState, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Well } from '@/lib/types';
import Navigation from './Navigation';
import ExploreMenu from './ExploreMenu';
import WellPanel from './WellPanel';

interface Props {
  wells: Well[];
  ngoName?: string;
}

const REGION_CENTER = { longitude: 0.5, latitude: 9.5, zoom: 6.5 };
const LANDING_VIEW = { longitude: 0.5, latitude: 9.0, zoom: 5.2 };

export default function MapClient({ wells, ngoName = 'WellMap' }: Props) {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const handleExplore = useCallback(() => {
    setShowLanding(false);
    mapRef.current?.flyTo({
      center: [REGION_CENTER.longitude, REGION_CENTER.latitude],
      zoom: REGION_CENTER.zoom,
      duration: 2800,
      essential: true,
    });
  }, []);

  const handleWellClick = useCallback((well: Well) => {
    setSelectedWell(well);
    setMenuOpen(false);
    mapRef.current?.flyTo({
      center: [well.longitude, well.latitude],
      zoom: 12,
      duration: 2000,
      essential: true,
    });
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedWell(null);
    mapRef.current?.flyTo({
      center: [REGION_CENTER.longitude, REGION_CENTER.latitude],
      zoom: REGION_CENTER.zoom,
      duration: 1600,
    });
  }, []);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-cream gap-4 p-8 text-center">
        <div className="text-5xl">💧</div>
        <h1 className="font-serif text-3xl text-forest">Add your Mapbox token</h1>
        <p className="font-sans text-sm text-forest/60 max-w-sm">
          Copy <code className="bg-forest/10 px-1.5 py-0.5 rounded text-forest font-mono text-xs">.env.local.example</code> to{' '}
          <code className="bg-forest/10 px-1.5 py-0.5 rounded text-forest font-mono text-xs">.env.local</code> and add your{' '}
          <a
            href="https://account.mapbox.com/"
            target="_blank"
            rel="noreferrer"
            className="underline text-forest"
          >
            Mapbox access token
          </a>
          , then restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mapbox map — always mounted */}
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={LANDING_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        attributionControl={false}
        logoPosition="bottom-right"
      >
        {/* Compass only (no zoom buttons — those clash with the aesthetic) */}
        <NavigationControl position="bottom-left" showCompass showZoom={false} />

        {/* Well markers — only visible after leaving landing */}
        {!showLanding &&
          wells.map((well) => (
            <Marker
              key={well.id}
              longitude={well.longitude}
              latitude={well.latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleWellClick(well);
              }}
            >
              <WellMarker isSelected={selectedWell?.id === well.id} status={well.status} />
            </Marker>
          ))}
      </Map>

      {/* ── Landing overlay ─────────────────────────────────── */}
      {showLanding && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          {/* Fog layers */}
          <div className="fog-left animate-fog-left" />
          <div className="fog-right animate-fog-right" />

          {/* Soft dark veil */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Hero text */}
          <div className="relative z-10 text-center text-white px-6 pointer-events-auto animate-fade-in-slow">
            <p className="font-sans text-[11px] tracking-[0.4em] text-gold uppercase mb-5">
              Clean Water For
            </p>
            <h1 className="font-serif font-light leading-[0.92] text-[clamp(64px,12vw,120px)] mb-6">
              WEST<br />AFRICA
            </h1>
            <p className="font-sans text-sm text-white/75 mb-10 max-w-xs mx-auto leading-relaxed">
              Transforming communities in Ghana, Togo &amp; Benin through access to safe, clean water.
            </p>
            <button
              onClick={handleExplore}
              className="border border-white/80 text-white font-sans text-[11px] tracking-[0.25em] uppercase px-9 py-4 hover:bg-white hover:text-forest transition-all duration-300"
            >
              Explore the Wells
            </button>
          </div>

          {/* Bottom hint */}
          <button
            onClick={handleExplore}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 font-sans text-[10px] tracking-[0.25em] uppercase hover:text-white/80 transition-colors pointer-events-auto"
          >
            View Map
          </button>
        </div>
      )}

      {/* ── Top navigation ──────────────────────────────────── */}
      {!showLanding && (
        <Navigation
          onMenuClick={() => setMenuOpen(true)}
          wellCount={wells.length}
          ngoName={ngoName}
        />
      )}

      {/* ── Explore menu ────────────────────────────────────── */}
      {menuOpen && (
        <ExploreMenu
          wells={wells}
          onWellClick={handleWellClick}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* ── Well detail panel ───────────────────────────────── */}
      {selectedWell && (
        <WellPanel well={selectedWell} onClose={handleClosePanel} />
      )}
    </div>
  );
}

function WellMarker({ isSelected, status }: { isSelected: boolean; status: string }) {
  const ringColor = status === 'planned' ? 'ring-sky-400' : 'ring-white';

  return (
    <button
      className={`
        w-8 h-8 rounded-full flex items-center justify-center shadow-lg
        transition-all duration-300 cursor-pointer
        hover:scale-125 focus:outline-none
        ${isSelected
          ? `bg-forest scale-125 ring-2 ${ringColor} ring-offset-1`
          : 'bg-white hover:shadow-xl'}
      `}
    >
      <svg
        viewBox="0 0 24 30"
        fill="currentColor"
        className={`w-[14px] h-[14px] ${isSelected ? 'text-white' : 'text-forest'}`}
      >
        <path d="M12 0C12 0 2 11 2 18a10 10 0 0020 0C22 11 12 0 12 0z" />
      </svg>
    </button>
  );
}
