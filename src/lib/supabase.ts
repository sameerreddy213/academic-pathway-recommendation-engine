import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Submission = {
  id: string;
  name: string;
  email: string;
  qualification: string;
  experience: string;
  profession: string;
  career_goal: string;
  recommendation: string;
  recommendation_reason: string;
  created_at: string;
};

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase env vars are not configured.");
    }
    _client = createClient(url, key);
  }
  return _client;
}
