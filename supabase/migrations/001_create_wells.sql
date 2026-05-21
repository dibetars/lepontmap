-- Wells table for NGO water project locations
CREATE TABLE IF NOT EXISTS public.wells (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT         NOT NULL,
  community    TEXT         NOT NULL,
  country      TEXT         NOT NULL CHECK (country IN ('Ghana', 'Togo', 'Benin')),
  latitude     DECIMAL(10, 8) NOT NULL,
  longitude    DECIMAL(11, 8) NOT NULL,
  year_built   INTEGER      CHECK (year_built > 1990 AND year_built <= EXTRACT(YEAR FROM NOW())::INTEGER),
  people_served INTEGER     CHECK (people_served > 0),
  description  TEXT,
  image_url    TEXT,
  status       TEXT         DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'planned')),
  created_at   TIMESTAMPTZ  DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.wells ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view well locations)
CREATE POLICY "Public read wells" ON public.wells
  FOR SELECT TO anon, authenticated USING (true);

-- Only authenticated users can insert/update (for admin panel)
CREATE POLICY "Auth insert wells" ON public.wells
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update wells" ON public.wells
  FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX wells_country_idx ON public.wells (country);
CREATE INDEX wells_status_idx  ON public.wells (status);

COMMENT ON TABLE public.wells IS 'NGO water well locations in Ghana, Togo, and Benin';
