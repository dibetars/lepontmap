'use client';

import type { Country } from '@/lib/types';

interface CountryCard {
  country: Country;
  image: string;
}

const CARDS: CountryCard[] = [
  { country: 'Togo', image: '/images/togo.jpg' },
  { country: 'Ghana', image: '/images/ghana.jpg' },
  { country: 'Benin', image: '/images/benin.jpg' },
];

interface Props {
  onSelect: (country: Country) => void;
}

export default function CountryGrid({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-4xl mx-auto px-2">
      {CARDS.map(({ country, image }) => (
        <button
          key={country}
          onClick={() => onSelect(country)}
          className="group relative flex flex-col overflow-hidden rounded-xl shadow-xl focus:outline-none"
        >
          {/* Photo */}
          <div
            className="h-44 sm:h-52 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          {/* Label bar */}
          <div className="bg-forest-mid py-4 px-5 text-left">
            <span className="font-sans font-bold text-white text-lg sm:text-xl">
              {country}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
