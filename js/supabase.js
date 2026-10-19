const SUPABASE_URL = 'https://ropcldgovuffawlkdpge.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcGNsZGdvdnVmZmF3bGtkcGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMjc5OTUsImV4cCI6MjEwNzkwMzk5NX0.WWt0ATs60Xcxnt0gskYqI6s3twwrj9rtlJVZFaeXNdQ';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});