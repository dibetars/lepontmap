import { createClient } from '@supabase/supabase-js';
import type { Well } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchWells(): Promise<Well[]> {
  const { data, error } = await supabase
    .from('wells')
    .select('*')
    .order('country', { ascending: true });

  if (error) {
    console.error('Error fetching wells:', error);
    return [];
  }

  return data ?? [];
}
