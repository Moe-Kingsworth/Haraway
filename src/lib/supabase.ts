import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://educveznypnobejyaial.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof process !== "undefined" ? process.env?.SUPABASE_ANON_KEY : undefined) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdWN2ZXpueXBub2JlanlhaWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzg5ODIsImV4cCI6MjA3MTExNDk4Mn0.JeBdB6nPGBRR03QS2Le5OdjOjw2V-05nOdhwiPS7Z8E";

export const SUPABASE_SERVICE_ROLE_KEY =
  (typeof process !== "undefined" ? process.env?.SUPABASE_SERVICE_ROLE_KEY : undefined) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdWN2ZXpueXBub2JlanlhaWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzODk4MiwiZXhwIjoyMDcxMTE0OTgyfQ.2T-41E4JBfT49KxY_cuf2EhgDAGrFqdg-ybqbKfeYZ8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
