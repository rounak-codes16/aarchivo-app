const REM = { on: 'archivo-rem-on', time: 'archivo-rem-time', last: 'archivo-rem-last' };

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

async function showReminder() {
  const opts = { body: t('rem_body'), icon: undefined, tag: 'archivo-daily' };
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) { reg.showNotification('Archivo 🔥', opts); return; }
  } catch (e) {}
  new Notification('Archivo 🔥', opts);
}

function remStatus() {
  const el = document.getElementById('rem-status');
  if (!el) return;
  if (!('Notification' in window)) { el.textContent = t('rem_unsupported'); return; }
  const p = Notification.permission;
  el.textContent = p === 'granted' ? t('rem_ok') : p === 'denied' ? t('rem_blocked') : t('rem_ask');
}

async function remToggle() {
  const on = document.getElementById('rem-on').checked;
  if (on && 'Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  localStorage.setItem(REM.on, on ? '1' : '0');
  remStatus();
}

function remSave() {
  localStorage.setItem(REM.time, document.getElementById('rem-time').value);
  localStorage.removeItem(REM.last);
}

async function remTest() {
  if (!('Notification' in window)) { remStatus(); return; }
  if (Notification.permission === 'default') await Notification.requestPermission();
  remStatus();
  if (Notification.permission === 'granted') showReminder();
}

function remCheck() {
  if (localStorage.getItem(REM.on) !== '1') return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const time = localStorage.getItem(REM.time) || '20:00';
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const diff = now.getHours() * 60 + now.getMinutes() - (h * 60 + m);
  if (diff >= 0 && diff < 60 && localStorage.getItem(REM.last) !== todayStr()) {
    localStorage.setItem(REM.last, todayStr());
    showReminder();
  }
}

function initReminders() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  document.getElementById('rem-on').checked = localStorage.getItem(REM.on) === '1';
  document.getElementById('rem-time').value = localStorage.getItem(REM.time) || '20:00';
  remStatus();
  setInterval(remCheck, 30000);
  remCheck();
  const prev = window.onLangChange;
  window.onLangChange = () => { if (prev) prev(); remStatus(); };
}

initReminders();