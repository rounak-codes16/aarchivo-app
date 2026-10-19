// Pehle se login hai to seedha dashboard par bhejo
(async () => {
  const { data } = await db.auth.getSession();
  if (data.session) window.location.href = 'app.html';
})();

async function handleSubmit() {
  const msg = document.getElementById('msg');
  const btn = document.getElementById('submit-btn');
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value.trim();

  const show = (text, ok = false) => {
    msg.className = 'text-sm text-center ' + (ok ? 'text-green-500' : 'text-red-500');
    msg.textContent = text;
  };

  btn.disabled = true;
  show(t('wait'), true);

  try {
    if (mode === 'signup') {
      if (username.length < 3) { show(t('short')); btn.disabled = false; return; }
      const { data, error } = await db.auth.signUp({
        email, password, options: { data: { username } }
      });
      if (error) throw error;
      if (data.session) {
        show(t('created'), true);
        window.location.href = 'app.html';
      } else {
        show(t('created_confirm'), true);
      }
    } else {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      show(t('logged'), true);
      window.location.href = 'app.html';
    }
  } catch (e) {
    show(e.message);
  }
  btn.disabled = false;
}