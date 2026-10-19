const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

async function loadAnalytics() {
  const { data } = await db.from('checkins').select('day').is('project_id', null);
  const days = new Set((data || []).map(r => r.day));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Heatmap: pichhle 12 hafte (columns = hafte, rows = Sun..Sat)
  const start = new Date(today);
  start.setDate(start.getDate() - today.getDay() - 77);
  let cols = '';
  for (let w = 0; w < 12; w++) {
    let col = '';
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + w * 7 + d);
      const key = ymd(dt);
      const future = dt > today;
      const done = days.has(key);
      const color = future ? 'opacity-0'
        : done ? 'bg-green-500'
        : 'bg-slate-200 dark:bg-slate-700';
      col += `<div title="${key}" class="w-5 h-5 rounded ${color}"></div>`;
    }
    cols += `<div class="flex flex-col gap-1">${col}</div>`;
  }
  document.getElementById('heatmap').innerHTML = cols;

  // Pichhle 7 din ka chart
  const names = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  let bars = '';
  let weekCount = 0;
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const done = days.has(ymd(dt));
    if (done) weekCount++;
    bars += `
      <div class="flex-1 flex flex-col items-center gap-1">
        <div class="w-full h-16 flex items-end">
          <div class="w-full rounded ${done ? 'bg-green-500 h-full' : 'bg-slate-200 dark:bg-slate-700 h-2'}"></div>
        </div>
        <span class="text-xs text-slate-500 dark:text-slate-400">${names[dt.getDay()]}</span>
      </div>`;
  }
  document.getElementById('weekbars').innerHTML = bars;

  // Stats
  const monthPrefix = today.getFullYear() + '-' + pad(today.getMonth() + 1);
  const monthCount = [...days].filter(d => d.startsWith(monthPrefix)).length;

  const sorted = [...days].sort();
  let best = 0, run = 0, prev = null;
  for (const s of sorted) {
    const cur = new Date(s + 'T00:00:00');
    if (prev && Math.round((cur - prev) / 86400000) === 1) run++;
    else run = 1;
    if (run > best) best = run;
    prev = cur;
  }

  document.getElementById('st-week').textContent = weekCount + '/7';
  document.getElementById('st-month').textContent = monthCount;
  document.getElementById('st-total').textContent = days.size;
  document.getElementById('st-best').textContent = best;
}

// Check-in karne par heatmap bhi apne aap update ho
const _origCheckin = doCheckin;
doCheckin = async function () {
  await _origCheckin();
  loadAnalytics();
};

loadAnalytics();