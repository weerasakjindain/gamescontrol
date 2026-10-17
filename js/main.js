import { supabase, esc } from './config.js';

const grid = document.getElementById('grid');
const tabs = document.getElementById('tabs');
const search = document.getElementById('search');
let games = [];
let activeCat = 'all';

async function load() {
  const [cats, gs] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('games').select('*, categories(name)')
      .eq('is_published', true).order('created_at', { ascending: false })
  ]);
  if (gs.error) { grid.innerHTML = '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>'; return; }

  games = gs.data || [];
  const list = [{ id: 'all', name: 'ทั้งหมด' }, ...(cats.data || [])];
  tabs.innerHTML = list.map(c =>
    `<button data-cat="${c.id}" class="${String(c.id) === activeCat ? 'active' : ''}">${esc(c.name)}</button>`
  ).join('');
  render();
}

function render() {
  const q = search.value.trim().toLowerCase();
  const list = games.filter(g =>
    (activeCat === 'all' || String(g.category_id) === activeCat) &&
    g.title.toLowerCase().includes(q));

  grid.innerHTML = list.length ? list.map(g => `
    <a class="card" href="play.html?id=${g.id}">
      <img src="${esc(g.thumbnail_url || 'https://placehold.co/400x225?text=Game')}" alt="" loading="lazy" />
      <div class="info">
        <h3>${esc(g.title)}</h3>
        <span>${esc(g.categories?.name || 'ไม่มีหมวดหมู่')}</span>
      </div>
    </a>`).join('') : '<p class="empty">ไม่พบเกม</p>';
}

tabs.onclick = e => {
  const id = e.target.dataset.cat;
  if (!id) return;
  activeCat = id;
  tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.cat === id));
  render();
};
search.oninput = render;
load();
