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

export default function WellPanel({ well, onClose }: Props) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className={`absolute inset-y-0 right-0 w-full max-w-[420px] z-30 flex flex-col shadow-2xl ${
        closing ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
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
        {/* Photo */}
        <div className="relative h-52 w-full bg-forest-mid">
          {well.image_url && (
            <Image
              src={well.image_url}
              alt={`${well.name} — ${well.community}`}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
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
            <p className="font-sans text-sm text-forest/75 leading-relaxed">{well.description}</p>
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
