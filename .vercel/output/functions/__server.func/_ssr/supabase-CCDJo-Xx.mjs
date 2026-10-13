import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-CCDJo-Xx.js
var SUPABASE_URL = (typeof process !== "undefined" ? process.env?.SUPABASE_URL : void 0) || typeof import.meta !== "undefined" && "https://educveznypnobejyaial.supabase.co" || "https://educveznypnobejyaial.supabase.co";
var SUPABASE_ANON_KEY = (typeof process !== "undefined" ? process.env?.SUPABASE_ANON_KEY : void 0) || typeof import.meta !== "undefined" && "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdWN2ZXpueXBub2JlanlhaWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzg5ODIsImV4cCI6MjA3MTExNDk4Mn0.JeBdB6nPGBRR03QS2Le5OdjOjw2V-05nOdhwiPS7Z8E" || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdWN2ZXpueXBub2JlanlhaWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzg5ODIsImV4cCI6MjA3MTExNDk4Mn0.JeBdB6nPGBRR03QS2Le5OdjOjw2V-05nOdhwiPS7Z8E";
var SUPABASE_SERVICE_ROLE_KEY = (typeof process !== "undefined" ? process.env?.SUPABASE_SERVICE_ROLE_KEY : void 0) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdWN2ZXpueXBub2JlanlhaWFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUzODk4MiwiZXhwIjoyMDcxMTE0OTgyfQ.2T-41E4JBfT49KxY_cuf2EhgDAGrFqdg-ybqbKfeYZ8";
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: {
	persistSession: true,
	autoRefreshToken: true,
	detectSessionInUrl: true
} });
var supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: {
	persistSession: false,
	autoRefreshToken: false
} });
//#endregion
export { supabaseAdmin as n, supabase as t };
