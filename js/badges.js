const BADGES = [
  { code: 'first', icon: '🌱' },
  { code: 'streak3', icon: '🔥' },
  { code: 'streak7', icon: '🏅' },
  { code: 'streak30', icon: '🏆' },
  { code: 'total30', icon: '💎' }
];

Object.assign(I18N.en, {
  freeze_title: '🧊 Freeze Pass', freeze_use: 'Use pass',
  freeze_hint: 'Missed yesterday? A pass saves your streak.',
  freeze_none: 'You missed yesterday but have no pass left.',
  freeze_fail: 'Pass could not be used', badges_title: '🏅 Badges', new_badge: 'New badge unlocked!',
  b_first: 'First Step', b_first_d: 'Your first check-in',
  b_streak3: '3-Day Spark', b_streak3_d: '3 days in a row (+20 XP)',
  b_streak7: 'Week Warrior', b_streak7_d: '7 days in a row (+50 XP, +1 pass)',
  b_streak30: 'Monthly Master', b_streak30_d: '30 days in a row (+200 XP, +2 passes)',
  b_total30: '30 Club', b_total30_d: '30 check-ins in total (+100 XP)'
});
Object.assign(I18N.hi, {
  freeze_title: '🧊 फ्रीज़ पास', freeze_use: 'पास इस्तेमाल करें',
  freeze_hint: 'कल का चेक-इन छूट गया? पास से स्ट्रीक बच जाएगी।',
  freeze_none: 'कल छूट गया, पर कोई पास नहीं बचा।',
  freeze_fail: 'पास इस्तेमाल नहीं हो सका', badges_title: '🏅 बैज', new_badge: 'नया बैज मिला!',
  b_first: 'पहला कदम', b_first_d: 'आपका पहला चेक-इन',
  b_streak3: '3 दिन की चिंगारी', b_streak3_d: 'लगातार 3 दिन (+20 XP)',
  b_streak7: 'वीक वॉरियर', b_streak7_d: 'लगातार 7 दिन (+50 XP, +1 पास)',
  b_streak30: 'मंथली मास्टर', b_streak30_d: 'लगातार 30 दिन (+200 XP, +2 पास)',
  b_total30: '30 क्लब', b_total30_d: 'कुल 30 चेक-इन (+100 XP)'
});
Object.assign(I18N.hn, {
  freeze_title: '🧊 Freeze Pass', freeze_use: 'Pass use karein',
  freeze_hint: 'Kal ka check-in chhoot gaya? Pass se streak bach jayegi.',
  freeze_none: 'Kal chhoot gaya, par koi pass nahi bacha.',
  freeze_fail: 'Pass use nahi ho saka', badges_title: '🏅 Badges', new_badge: 'Naya badge mila!',
  b_first: 'Pehla Kadam', b_first_d: 'Aapka pehla check-in',
  b_streak3: '3-Din ki Chingari', b_streak3_d: 'Lagatar 3 din (+20 XP)',
  b_streak7: 'Week Warrior', b_streak7_d: 'Lagatar 7 din (+50 XP, +1 pass)',
  b_streak30: 'Monthly Master', b_streak30_d: 'Lagatar 30 din (+200 XP, +2 pass)',
  b_total30: '30 Club', b_total30_d: 'Kul 30 check-in (+100 XP)'
});

function renderBadges(earned) {
  const el = document.getElementById('badges');
  if (!el) return;
  el.innerHTML = BADGES.map(b => {
    const got = earned.has(b.code);
    return `<div title="${t('b_' + b.code + '_d')}" class="text-center ${got ? '' : 'opacity-30 grayscale'}">
      <div class="text-3xl">${b.icon}</div>
      <div class="text-[10px] leading-tight mt-1">${t('b_' + b.code)}</div>
    </div>`;
  }).join('');
}

function toastBadges(codes) {
  const box = document.createElement('div');
  box.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-lg text-sm text-center z-50';
  box.innerHTML = '🎉 ' + t('new_badge') + '<br>' +
    codes.map(c => BADGES.find(b => b.code === c).icon + ' ' + t('b_' + c)).join(' • ');
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}