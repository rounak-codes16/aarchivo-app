Object.assign(I18N.en, { chat_ph: 'Type a message...', chat_send: 'Send', chat_empty: 'No messages yet. Say hi 👋', chat_new: 'New message from' });
Object.assign(I18N.hi, { chat_ph: 'संदेश लिखें...', chat_send: 'भेजें', chat_empty: 'अभी कोई संदेश नहीं। नमस्ते कहें 👋', chat_new: 'नया संदेश' });
Object.assign(I18N.hn, { chat_ph: 'Message likho...', chat_send: 'Send', chat_empty: 'Abhi koi message nahi. Hi bolo 👋', chat_new: 'Naya message' });

let chatWith = null;
const chatShown = new Set();

document.body.insertAdjacentHTML('beforeend', `
<div id="chat-modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
  <div class="w-full max-w-md h-[85vh] sm:h-[600px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-t-2xl sm:rounded-2xl flex flex-col shadow-xl">
    <div class="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
      <span id="chat-title" class="font-semibold"></span>
      <button onclick="closeChat()" class="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700">✕</button>
    </div>
    <div id="chat-msgs" class="flex-1 overflow-y-auto p-3 space-y-2"></div>
    <div class="flex gap-2 p-3 border-t border-slate-200 dark:border-slate-700">
      <input id="chat-input" maxlength="1000" onkeydown="if(event.key==='Enter')sendChat()"
        class="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent">
      <button id="chat-send" onclick="sendChat()" class="px-4 rounded-lg bg-indigo-600 text-white font-semibold"></button>
    </div>
  </div>
</div>`);

function chatBubble(m) {
  const mine = m.sender === currentUser.id;
  const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `<div class="flex ${mine ? 'justify-end' : 'justify-start'}">
    <div class="max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words ${mine ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}">
      ${esc(m.body)}<div class="text-[10px] opacity-60 text-right mt-1">${time}</div>
    </div></div>`;
}

function chatAppend(m) {
  if (chatShown.has(m.id)) return;
  chatShown.add(m.id);
  const box = document.getElementById('chat-msgs');
  const empty = document.getElementById('chat-empty');
  if (empty) empty.remove();
  box.insertAdjacentHTML('beforeend', chatBubble(m));
  box.scrollTop = box.scrollHeight;
}

async function openChat(id) {
  chatWith = id;
  chatShown.clear();
  document.getElementById('chat-title').textContent = '💬 ' + (chatNames[id] || '');
  document.getElementById('chat-input').placeholder = t('chat_ph');
  document.getElementById('chat-send').textContent = t('chat_send');
  document.getElementById('chat-modal').classList.remove('hidden');
  const box = document.getElementById('chat-msgs');
  box.innerHTML = '';
  const me = currentUser.id;
  const { data, error } = await db.from('messages').select('*')
    .or(`and(sender.eq.${me},receiver.eq.${id}),and(sender.eq.${id},receiver.eq.${me})`)
    .order('created_at', { ascending: false }).limit(100);
  if (error) { box.innerHTML = '<p class="text-xs text-red-500">' + esc(error.message) + '</p>'; return; }
  const rows = (data || []).reverse();
  if (!rows.length) box.innerHTML = '<p id="chat-empty" class="text-center text-sm text-slate-500 dark:text-slate-400 py-10">' + t('chat_empty') + '</p>';
  rows.forEach(chatAppend);
  document.getElementById('chat-input').focus();
}

function closeChat() {
  chatWith = null;
  document.getElementById('chat-modal').classList.add('hidden');
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const body = input.value.trim();
  if (!body || !chatWith) return;
  input.value = '';
  const { data, error } = await db.from('messages')
    .insert({ receiver: chatWith, body }).select().single();
  if (error) { input.value = body; alert(error.message); return; }
  chatAppend(data);
}

function chatToast(text) {
  const box = document.createElement('div');
  box.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-lg text-sm z-50 max-w-[90%]';
  box.textContent = text;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}

async function initChat() {
  const { data } = await db.auth.getSession();
  if (!data.session) return;
  if (!currentUser) currentUser = data.session.user;
  db.channel('messages-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      const m = payload.new;
      if (m.sender === currentUser.id) { if (m.receiver === chatWith) chatAppend(m); return; }
      if (m.receiver !== currentUser.id) return;
      if (m.sender === chatWith) chatAppend(m);
      else chatToast('💬 ' + (chatNames[m.sender] || t('chat_new')) + ': ' + m.body.slice(0, 60));
    })
    .subscribe();
}

const _chatPrevLang = window.onLangChange;
window.onLangChange = () => {
  if (_chatPrevLang) _chatPrevLang();
  document.getElementById('chat-input').placeholder = t('chat_ph');
  document.getElementById('chat-send').textContent = t('chat_send');
};

initChat();