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

export default async function Home() {
  const wells = await getWells();
  return (
    <MapClient
      wells={wells}
      ngoName="Le Pont"
    />
  );
}
