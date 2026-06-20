'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Well } from '@/lib/types';

const FLAG: Record<string, string> = { Ghana: '🇬🇭', Togo: '🇹🇬', Benin: '🇧🇯' };

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-emerald-500',
  maintenance: 'bg-amber-500',
  planned: 'bg-sky-500',
};

interface Props {
  well: Well;
  onClose: () => void;
}

function getPhotos(well: Well): string[] {
  if (well.images && well.images.length > 0) return well.images.slice(0, 2);
  if (well.image_url) return [well.image_url];
  return [];
}

function getYouTubeId(url: string): string | null {
  const m =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/) ||
    url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function VideoPlayer({ url }: { url: string }) {
  const ytId = getYouTubeId(url);

  if (ytId) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Well video"
        />
      </div>
    );
  }

  return (
    <video
      src={url}
      controls
      playsInline
      className="w-full"
      style={{ maxHeight: '240px', background: '#000' }}
    />
  );
}

export default function WellPanel({ well, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = getPhotos(well);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  const prevPhoto = () => setPhotoIndex((i) => Math.max(0, i - 1));
  const nextPhoto = () => setPhotoIndex((i) => Math.min(photos.length - 1, i + 1));

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 max-h-[85vh] md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-[420px] md:max-h-none z-30 flex flex-col shadow-2xl ${
        closing ? 'panel-exit' : 'panel-enter'
      }`}
    >
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center pt-3 pb-1 bg-cream shrink-0">
        <div className="w-10 h-1 rounded-full bg-forest/20" />
      </div>

      {/* Header bar */}
      <div className="bg-forest text-white flex items-center justify-between px-6 py-[18px] shrink-0">
        <h2 className="font-sans text-[11px] tracking-[0.25em] uppercase truncate pr-4">
          {well.name}
        </h2>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors shrink-0"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto bg-cream">

        {/* ── Photo carousel ───────────────────────────────── */}
        {photos.length > 0 && (
          <div className="relative h-56 w-full bg-forest/20 shrink-0 overflow-hidden">
            <Image
              key={photos[photoIndex]}
              src={photos[photoIndex]}
              alt={`${well.name} photo ${photoIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={photoIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
                  aria-label="Previous photo"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={photoIndex === photos.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-30"
                  aria-label="Next photo"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === photoIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── No photo placeholder ─────────────────────────── */}
        {photos.length === 0 && (
          <div className="h-36 w-full bg-forest/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-forest/20">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────── */}
        <div className="px-8 py-8">
          {/* Country badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{FLAG[well.country]}</span>
            <span className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase">
              {well.country}
            </span>
          </div>

          <h3 className="font-serif text-3xl text-forest leading-tight mb-1">{well.name}</h3>
          <p className="font-sans text-sm text-forest/60 mb-7">{well.community}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 border-y border-forest/10 mb-7">
            {well.year_built && (
              <Stat label="Year Built" value={well.year_built.toString()} />
            )}
            {well.people_served && (
              <Stat label="People Served" value={well.people_served.toLocaleString()} />
            )}
            <div>
              <p className="font-sans text-[10px] text-gold tracking-[0.2em] uppercase mb-1.5">
                Status
              </p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[well.status]}`} />
                <span className="font-sans text-sm text-forest capitalize">{well.status}</span>
              </div>
            </div>
            <Stat label="Coordinates" value={`${well.latitude.toFixed(3)}°, ${well.longitude.toFixed(3)}°`} />
          </div>

          {/* Description */}
          {well.description && (
            <p className="font-sans text-sm text-forest/75 leading-relaxed mb-8">{well.description}</p>
          )}

          {/* ── Video ──────────────────────────────────────── */}
          {well.video_url && (
            <div>
              <p className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase mb-3">
                Video
              </p>
              <div className="rounded overflow-hidden shadow-md">
                <VideoPlayer url={well.video_url} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[10px] text-gold tracking-[0.2em] uppercase mb-1.5">{label}</p>
      <p className="font-serif text-xl text-forest">{value}</p>
    </div>
  );
}
