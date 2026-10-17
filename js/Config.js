import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ใส่ค่าจาก Supabase ตรงนี้ (anon key เปิดเผยได้ เพราะมี RLS คุมสิทธิ์ไว้แล้ว)
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ป้องกัน XSS เวลานำข้อความไปแสดงใน HTML
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const isSafeUrl = (u = '') => /^https:\/\//i.test(u);
