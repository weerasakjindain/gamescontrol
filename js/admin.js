import { supabase, esc, isSafeUrl } from './config.js';

const $ = id => document.getElementById(id);
let categories = [];
let games = [];

const show = view => {
  $('login').hidden = view !== 'login';
  $('panel').hidden = view !== 'panel';
};

// ---------- Auth ----------
async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  session ? enterAdmin() : show('login');
}

$('loginForm').onsubmit = async e => {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({
    email: $('email').value, password: $('password').value
  });
  if (error) return alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
  enterAdmin();
};

$('logout').onclick = async () => { await supabase.auth.signOut(); show('login'); };

async function enterAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', user?.id).maybeSingle();
  if (!data) {
    alert('บัญชีนี้ไม่มีสิทธิ์แอดมิน');
    await supabase.auth.signOut();
    return show('login');
  }
  show('panel');
  await loadCategories();
  await loadGames();
}

// ---------- Categories ----------
async function loadCategories() {
  const { data } = await supabase.from('categories').select('*').order('name');
  categories = data || [];
  $('catList').innerHTML = categories.map(c =>
    `<li>${esc(c.name)} <button class="ghost" data-del-cat="${c.id}">ลบ</button></li>`).join('');
  $('gCategory').innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>' +
    categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
}

$('catForm').onsubmit = async e => {
  e.preventDefault();
  const { error } = await supabase.from('categories').insert({ name: $('catName').value.trim() });
  if (error) return alert(error.message);
  $('catName').value = '';
  loadCategories();
};

$('catList').onclick = async e => {
  const id = e.target.dataset.delCat;
  if (!id || !confirm('ลบหมวดหมู่นี้? (เกมในหมวดจะไม่ถูกลบ)')) return;
  await supabase.from('categories').delete().eq('id', id);
  await loadCategories();
  loadGames();
};

// ---------- Games ----------
async function loadGames() {
  const { data } = await supabase.from('games').select('*, categories(name)')
    .order('created_at', { ascending: false });
  games = data || [];
  $('gameRows').innerHTML = games.map(g => `
    <tr>
      <td>${esc(g.title)}</td>
      <td>${esc(g.categories?.name || '-')}</td>
      <td>${g.is_published ? '✅ เผยแพร่' : '⛔ ซ่อน'}</td>
      <td>
        <button data-edit="${g.id}">แก้ไข</button>
        <button class="ghost" data-del="${g.id}">ลบ</button>
      </td>
    </tr>`).join('');
}

function fillForm(g = null) {
  $('gId').value = g?.id || '';
  $('gTitle').value = g?.title || '';
  $('gUrl').value = g?.game_url || '';
  $('gThumb').value = g?.thumbnail_url || '';
  $('gDev').value = g?.developer || '';
  $('gCategory').value = g?.category_id || '';
  $('gDesc').value = g?.description || '';
  $('gPublished').checked = g ? g.is_published : true;
  $('formTitle').textContent = g ? 'แก้ไขเกม' : 'เพิ่มเกมใหม่';
  if (g) window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('gameRows').onclick = async e => {
  const { edit, del } = e.target.dataset;
  if (edit) fillForm(games.find(g => String(g.id) === edit));
  if (del && confirm('ยืนยันการลบเกมนี้?')) {
    await supabase.from('games').delete().eq('id', del);
    loadGames();
  }
};

$('gameForm').onsubmit = async e => {
  e.preventDefault();
  const row = {
    title: $('gTitle').value.trim(),
    game_url: $('gUrl').value.trim(),
    thumbnail_url: $('gThumb').value.trim() || null,
    developer: $('gDev').value.trim() || null,
    category_id: $('gCategory').value || null,
    description: $('gDesc').value.trim() || null,
    is_published: $('gPublished').checked
  };
  if (!isSafeUrl(row.game_url)) return alert('ลิงก์เกมต้องขึ้นต้นด้วย https://');

  const id = $('gId').value;
  const { error } = id
    ? await supabase.from('games').update(row).eq('id', id)
    : await supabase.from('games').insert(row);
  if (error) return alert(error.message);

  fillForm();
  loadGames();
};

$('cancelEdit').onclick = () => fillForm();
init();
