'use client';

import type { Well, Country } from '@/lib/types';

const COUNTRIES: Country[] = ['Ghana', 'Togo', 'Benin'];

const FLAG: Record<Country, string> = {
  Ghana: '🇬🇭',
  Togo: '🇹🇬',
  Benin: '🇧🇯',
};

interface Props {
  wells: Well[];
  onWellClick: (well: Well) => void;
  onClose: () => void;
}

export default function ExploreMenu({ wells, onWellClick, onClose }: Props) {
  const byCountry = COUNTRIES.map((country) => ({
    country,
    wells: wells.filter((w) => w.country === country),
  }));

  const totalPeople = wells.reduce((sum, w) => sum + (w.people_served ?? 0), 0);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-cream w-[calc(100%-2rem)] max-w-[320px] max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="px-8 pt-8 pb-5">
          <p className="font-sans text-[10px] text-gold tracking-[0.35em] uppercase mb-3">
            Explore Wells
          </p>
          <div className="h-px bg-forest/15" />
        </div>

        {/* Well list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {byCountry.map(
            ({ country, wells: cWells }) =>
              cWells.length > 0 && (
                <div key={country} className="mb-3">
                  <p className="font-sans text-[9px] text-forest/40 tracking-[0.3em] uppercase px-6 mb-1">
                    {FLAG[country]} {country}
                  </p>
                  {cWells.map((well) => (
                    <button
                      key={well.id}
                      onClick={() => onWellClick(well)}
                      className="w-full text-left px-6 py-2.5 font-serif text-[1.25rem] text-forest hover:bg-forest/5 transition-colors duration-150 leading-tight"
                    >
                      {well.name}
                    </button>
                  ))}
                </div>
              )
          )}

          {/* Stats footer inside scroll area */}
          <div className="mx-6 mt-4 mb-2 py-4 border-t border-forest/10">
            <p className="font-sans text-[9px] text-forest/40 tracking-[0.25em] uppercase mb-1">
              Total Impact
            </p>
            <p className="font-serif text-2xl text-forest">
              {totalPeople.toLocaleString()} people served
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="bg-forest text-white py-4 flex items-center justify-center gap-2 hover:bg-forest-mid transition-colors shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase">Close</span>
        </button>
      </div>
    </div>
  );
}
