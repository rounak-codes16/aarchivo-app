const lymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

async function loadStreak() {
  const { data: rows } = await db.from('checkins').select('day').is('project_id', null);
  const days = new Set((rows || []).map(r => r.day));

  const d = new Date(); d.setHours(0, 0, 0, 0);
  const doneToday = days.has(lymd(d));

  const c = new Date(d);
  if (!doneToday) c.setDate(c.getDate() - 1);
  let streak = 0;
  while (days.has(lymd(c))) { streak++; c.setDate(c.getDate() - 1); }

  const y = new Date(d); y.setDate(y.getDate() - 1);
  const yy = new Date(d); yy.setDate(yy.getDate() - 2);
  const canSave = !days.has(lymd(y)) && days.has(lymd(yy));

  const { data: prof } = await db.from('profiles')
    .select('xp, freezes').eq('id', currentUser.id).single();
  const { data: bd } = await db.from('badges').select('code');
  const freezes = prof ? prof.freezes : 0;

  document.getElementById('streak').textContent = streak;
  document.getElementById('xp').textContent = prof ? prof.xp : 0;
  document.getElementById('freeze-count').textContent = freezes;

  const btn = document.getElementById('checkin-btn');
  btn.disabled = doneToday;
  btn.textContent = doneToday ? t('checkin_done') : t('checkin');
  btn.className = 'w-full mt-3 py-3 rounded-xl font-semibold ' +
    (doneToday ? 'bg-slate-300 dark:bg-slate-700 text-slate-500' : 'bg-orange-500 text-white');

  const fb = document.getElementById('freeze-btn');
  const fh = document.getElementById('freeze-hint');
  fb.classList.toggle('hidden', !(canSave && freezes > 0));
  fh.textContent = !canSave ? '' : freezes > 0 ? t('freeze_hint') : t('freeze_none');

  renderBadges(new Set((bd || []).map(b => b.code)));
}

async function doCheckin() {
  const { data, error } = await db.rpc('do_checkin', { p_day: lymd(new Date()) });
  if (error) { showErr(error); return; }
  if (data && !data.ok) showErr(t('already'));
  else {
    showErr('');
    if (data.badges && data.badges.length) toastBadges(data.badges);
  }
  await loadStreak();
  if (typeof loadAnalytics === 'function') loadAnalytics();
}

async function useFreeze() {
  const { data, error } = await db.rpc('use_freeze', { p_today: lymd(new Date()) });
  if (error) { showErr(error); return; }
  if (data && !data.ok) showErr(t('freeze_fail')); else showErr('');
  await loadStreak();
  if (typeof loadAnalytics === 'function') loadAnalytics();
}