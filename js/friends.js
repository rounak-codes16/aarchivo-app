Object.assign(I18N.en, {
  fr_title: '👥 Friends', fr_ph: "Friend's username...", fr_add: 'Add',
  fr_sent: 'Request sent ✅', fr_notfound: 'No user with this username',
  fr_self: "You can't add yourself", fr_exists: 'Already a friend or request pending',
  fr_incoming: 'Requests for you', fr_outgoing: 'Sent requests', fr_list: 'Your friends',
  fr_accept: 'Accept', fr_decline: 'Decline', fr_cancel: 'Cancel',
  fr_none: 'No friends yet. Add one using their username 👆', fr_remove: 'Remove this friend?'
});
Object.assign(I18N.hi, {
  fr_title: '👥 दोस्त', fr_ph: 'दोस्त का यूज़रनेम...', fr_add: 'जोड़ें',
  fr_sent: 'रिक्वेस्ट भेज दी ✅', fr_notfound: 'इस नाम का कोई यूज़र नहीं मिला',
  fr_self: 'आप खुद को नहीं जोड़ सकते', fr_exists: 'पहले से दोस्त हैं या रिक्वेस्ट बाकी है',
  fr_incoming: 'आपके लिए रिक्वेस्ट', fr_outgoing: 'भेजी गई रिक्वेस्ट', fr_list: 'आपके दोस्त',
  fr_accept: 'मंज़ूर', fr_decline: 'मना करें', fr_cancel: 'रद्द करें',
  fr_none: 'अभी कोई दोस्त नहीं। यूज़रनेम से जोड़ें 👆', fr_remove: 'इस दोस्त को हटाएं?'
});
Object.assign(I18N.hn, {
  fr_title: '👥 Dost', fr_ph: 'Dost ka username...', fr_add: 'Add',
  fr_sent: 'Request bhej di ✅', fr_notfound: 'Is naam ka koi user nahi mila',
  fr_self: 'Aap khud ko add nahi kar sakte', fr_exists: 'Pehle se dost hain ya request pending hai',
  fr_incoming: 'Aapke liye requests', fr_outgoing: 'Bheji gayi requests', fr_list: 'Aapke dost',
  fr_accept: 'Accept', fr_decline: 'Decline', fr_cancel: 'Cancel',
  fr_none: 'Abhi koi dost nahi. Username se add karein 👆', fr_remove: 'Is dost ko hatayein?'
});

const chatNames = {};

function frMsg(text, ok) {
  const el = document.getElementById('fr-msg');
  el.className = 'text-xs mt-2 ' + (ok ? 'text-green-500' : 'text-red-500');
  el.textContent = text;
}

async function loadFriends() {
  const { data, error } = await db.rpc('list_friends');
  const box = document.getElementById('fr-list');
  if (error) { box.innerHTML = '<p class="text-xs text-red-500">' + esc(error.message) + '</p>'; return; }
  const rows = data || [];
  rows.forEach(r => { chatNames[r.other_id] = r.other_name || '?'; });
  const incoming = rows.filter(r => r.status === 'pending' && r.incoming);
  const outgoing = rows.filter(r => r.status === 'pending' && !r.incoming);
  const friends = rows.filter(r => r.status === 'accepted');
  const btn = 'px-3 py-1 rounded-lg text-xs font-semibold ';
  let html = '';

  if (incoming.length) {
    html += '<p class="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-1">' + t('fr_incoming') + '</p>';
    html += incoming.map(r => `
      <div class="flex items-center gap-2 py-1">
        <span class="flex-1">👤 ${esc(r.other_name || '?')}</span>
        <button onclick="respondFriend('${r.id}', true)" class="${btn}bg-green-500 text-white">${t('fr_accept')}</button>
        <button onclick="respondFriend('${r.id}', false)" class="${btn}bg-slate-200 dark:bg-slate-700">${t('fr_decline')}</button>
      </div>`).join('');
  }
  if (outgoing.length) {
    html += '<p class="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-1">' + t('fr_outgoing') + '</p>';
    html += outgoing.map(r => `
      <div class="flex items-center gap-2 py-1">
        <span class="flex-1">⏳ ${esc(r.other_name || '?')}</span>
        <button onclick="removeFriend('${r.id}', false)" class="${btn}bg-slate-200 dark:bg-slate-700">${t('fr_cancel')}</button>
      </div>`).join('');
  }
  html += '<p class="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-1">' + t('fr_list') + '</p>';
  html += friends.length ? friends.map(r => `
      <div class="flex items-center gap-2 py-1">
        <span class="flex-1">😊 ${esc(r.other_name || '?')}</span>
        <button onclick="openChat('${r.other_id}')" class="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">💬</button>
        <button onclick="removeFriend('${r.id}', true)" class="text-slate-400 hover:text-red-500 text-sm">✕</button>
      </div>`).join('')
    : '<p class="text-sm text-slate-500 dark:text-slate-400 py-2">' + t('fr_none') + '</p>';
  box.innerHTML = html;
}

async function addFriend() {
  const input = document.getElementById('fr-name');
  const name = input.value.trim();
  if (!name) return;
  const { data, error } = await db.rpc('send_request', { p_username: name });
  if (error) { frMsg(error.message, false); return; }
  if (data.ok) { frMsg(t('fr_sent'), true); input.value = ''; }
  else frMsg(t('fr_' + data.reason), false);
  loadFriends();
}

async function respondFriend(id, accept) {
  const { error } = await db.rpc('respond_request', { p_id: id, p_accept: accept });
  if (error) frMsg(error.message, false); else frMsg('', true);
  loadFriends();
}

async function removeFriend(id, ask) {
  if (ask && !confirm(t('fr_remove'))) return;
  const { error } = await db.from('friendships').delete().eq('id', id);
  if (error) frMsg(error.message, false); else frMsg('', true);
  loadFriends();
}

const _prevLang = window.onLangChange;
window.onLangChange = () => { if (_prevLang) _prevLang(); loadFriends(); };

loadFriends();