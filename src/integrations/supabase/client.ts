import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ogtqtjfeyjkkgokyrdzg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndHF0amZleWpra2dva3lyZHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzE0NjQsImV4cCI6MjA4MTY0NzQ2NH0.Zh1EDrQaiozxADZTO9F-u93e2ygQgHmW90H_ZOHM_TA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
