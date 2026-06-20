export type WellStatus = 'active' | 'maintenance' | 'planned';
export type Country = 'Ghana' | 'Togo' | 'Benin';

export interface Well {
  id: string;
  name: string;
  community: string;
  country: Country;
  latitude: number;
  longitude: number;
  year_built?: number;
  people_served?: number;
  description?: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  status: WellStatus;
  created_at?: string;
}
