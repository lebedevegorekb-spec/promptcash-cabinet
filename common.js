const API = 'https://api.gptcash.ru';
let API_KEY = localStorage.getItem('pc_api_key');

if (!API_KEY) {
  window.location.href = 'auth.html';
}

function logout() {
  localStorage.removeItem('pc_api_key');
  localStorage.removeItem('pc_advertiser');
  window.location.href = 'auth.html';
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, ...(opts.headers || {}) }
  });
  if (res.status === 401) { logout(); throw new Error('Сессия истекла'); }
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Ошибка'); }
  return res.json();
}

function updateBalance(bal) {
  const balEl = document.getElementById('sb-bal');
  const showsEl = document.getElementById('sb-shows');
  if (balEl) balEl.textContent = bal.toLocaleString('ru') + ' ₽';
  if (showsEl) showsEl.textContent = '≈ ' + bal.toLocaleString('ru') + ' показов осталось';
}

async function initSidebar() {
  try {
    const me = await apiFetch('/advertiser/me');
    const nameEl = document.getElementById('sb-company-name');
    const indEl = document.getElementById('sb-company-ind');
    if (nameEl) nameEl.textContent = me.companyName || me.name;
    if (indEl) indEl.textContent = me.industry || '—';
    updateBalance(me.balanceRub);
    return me;
  } catch(e) {
    console.error('sidebar init error', e);
    return null;
  }
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
