import dynamic from 'next/dynamic';
import { sampleWells } from '@/data/wells';

// Mapbox GL uses browser APIs — must be loaded client-side only
const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false });

async function getWells() {
  // If Supabase env vars are configured, fetch live data; otherwise use sample data
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { fetchWells } = await import('@/lib/supabase');
      const wells = await fetchWells();
      return wells.length > 0 ? wells : sampleWells;
    } catch {
      return sampleWells;
    }
  }
  return sampleWells;
}

const VALID_COUNTRIES = ['Ghana', 'Togo', 'Benin'] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: { embed?: string; country?: string };
}) {
  const wells = await getWells();
  const autoStart = searchParams.embed === '1';
  const lockedCountry = VALID_COUNTRIES.find(
    (c) => c.toLowerCase() === searchParams.country?.toLowerCase()
  );
  return (
    <MapClient
      wells={wells}
      ngoName="Le Pont"
      autoStart={autoStart}
      lockedCountry={lockedCountry}
    />
  );
}
