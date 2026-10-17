import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ใส่ค่าจาก Supabase ตรงนี้ (anon key เปิดเผยได้ เพราะมี RLS คุมสิทธิ์ไว้แล้ว)
const SUPABASE_URL = 'https://dwrvlsnivwxynzsegnnl.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_oFQ3BfKmwJf4rX1_3RHkYw_iljl_io-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ป้องกัน XSS เวลานำข้อความไปแสดงใน HTML
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const isSafeUrl = (u = '') => /^https:\/\//i.test(u);
