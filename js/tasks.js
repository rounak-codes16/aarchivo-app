let currentUser = null;

function showErr(e) {
  document.getElementById('err').textContent = e ? (e.message || e) : '';
}

async function init() {
  const { data } = await db.auth.getSession();
  if (!data.session) { window.location.href = 'index.html'; return; }
  currentUser = data.session.user;
  document.getElementById('who').textContent =
    (currentUser.user_metadata.username || '') + ' • ' + currentUser.email;
  loadProjects();
  loadStreak();
}

window.onLangChange = () => { loadProjects(); loadStreak(); };

async function logout() {
  await db.auth.signOut();
  window.location.href = 'index.html';
}

async function loadProjects() {
  const { data: projects, error: e1 } = await db.from('projects')
    .select('*').order('created_at', { ascending: false });
  const { data: tasks, error: e2 } = await db.from('tasks')
    .select('*').order('created_at');
  if (e1 || e2) { showErr(e1 || e2); return; }
  showErr('');
  render(projects, tasks);
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function render(projects, tasks) {
  const list = document.getElementById('list');
  if (!projects.length) {
    list.innerHTML = '<p class="text-center text-slate-500 dark:text-slate-400 py-10">' + t('none') + '</p>';
    return;
  }
  list.innerHTML = projects.map(p => {
    const ts = tasks.filter(t2 => t2.project_id === p.id);
    const done = ts.filter(t2 => t2.done).length;
    const pct = ts.length ? Math.round(done / ts.length * 100) : 0;
    return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold text-lg">${esc(p.icon || '🎯')} ${esc(p.title)}</h2>
        <button onclick="deleteProject('${p.id}')" class="text-slate-400 hover:text-red-500 text-sm">🗑️</button>
      </div>
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div class="h-full bg-indigo-600 transition-all" style="width:${pct}%"></div>
        </div>
        <span class="text-sm font-semibold w-12 text-right">${pct}%</span>
      </div>
      <div class="space-y-2 mb-3">
        ${ts.map(x => `
          <div class="flex items-center gap-2">
            <input type="checkbox" ${x.done ? 'checked' : ''} onchange="toggleTask('${x.id}', this.checked)" class="w-5 h-5">
            <span class="flex-1 ${x.done ? 'line-through text-slate-400' : ''}">${esc(x.title)}</span>
            <button onclick="deleteTask('${x.id}')" class="text-slate-400 hover:text-red-500 text-sm">✕</button>
          </div>`).join('')}
      </div>
      <div class="flex gap-2">
        <input id="t-${p.id}" placeholder="${t('sub_ph')}" onkeydown="if(event.key==='Enter')addTask('${p.id}')"
          class="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
        <button onclick="addTask('${p.id}')" class="px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm">${t('add')}</button>
      </div>
    </div>`;
  }).join('');
}

async function addProject() {
  const title = document.getElementById('new-title').value.trim();
  const icon = document.getElementById('new-icon').value.trim() || '🎯';
  if (!title) return;
  const { error } = await db.from('projects').insert({ title, icon });
  if (error) { showErr(error); return; }
  document.getElementById('new-title').value = '';
  loadProjects();
}

async function deleteProject(id) {
  if (!confirm(t('del'))) return;
  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) showErr(error);
  loadProjects();
}

async function addTask(projectId) {
  const input = document.getElementById('t-' + projectId);
  const title = input.value.trim();
  if (!title) return;
  const { error } = await db.from('tasks').insert({ project_id: projectId, title });
  if (error) { showErr(error); return; }
  loadProjects();
}

async function toggleTask(id, done) {
  const { error } = await db.from('tasks').update({ done }).eq('id', id);
  if (error) showErr(error);
  loadProjects();
}

async function deleteTask(id) {
  const { error } = await db.from('tasks').delete().eq('id', id);
  if (error) showErr(error);
  loadProjects();
}

init();