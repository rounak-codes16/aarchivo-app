const I18N = {
  en: {
    tagline: 'Build habits. Finish projects.', login: 'Login', signup: 'Sign Up',
    username: 'Username', email: 'Email', password: 'Password (min 6)',
    create: 'Create Account', wait: 'Please wait...',
    short: 'Username must be at least 3 characters',
    created: 'Account created! ✅', created_confirm: 'Account created. Confirm your email, then login.',
    logged: 'Logged in! ✅', logout: 'Logout', new_ph: 'New project or habit...',
    checkin: 'Check in today (+10 XP)', checkin_done: 'Checked in today ✅',
    streak_lbl: 'Day streak', xp: 'XP', progress: '📊 Your Progress',
    this_week: 'This week', this_month: 'This month', total: 'Total days', best: 'Best streak',
    last7: 'Last 7 days', last12: 'Last 12 weeks (green = checked in)',
    none: 'No projects yet. Create your first one above 👆',
    sub_ph: 'New sub-task...', add: 'Add', del: 'Delete this project?',
    already: 'Already checked in today',
    rem_title: '🔔 Daily Reminder', rem_time: 'Time', rem_test: 'Test',
    rem_ok: 'Notifications allowed ✅', rem_blocked: 'Notifications are blocked. Enable them in browser settings.',
    rem_ask: 'Turn the switch on and allow notifications', rem_unsupported: 'This browser does not support notifications',
    rem_body: 'Time to check in and keep your streak 🔥', rem_note: 'Works while the app or tab is open'
  },
  hi: {
    tagline: 'आदतें बनाएं। प्रोजेक्ट पूरे करें।', login: 'लॉगिन', signup: 'साइन अप',
    username: 'यूज़रनेम', email: 'ईमेल', password: 'पासवर्ड (कम से कम 6)',
    create: 'अकाउंट बनाएं', wait: 'कृपया रुकें...',
    short: 'यूज़रनेम कम से कम 3 अक्षर का रखें',
    created: 'अकाउंट बन गया! ✅', created_confirm: 'अकाउंट बन गया। ईमेल कन्फर्म करके लॉगिन करें।',
    logged: 'लॉगिन हो गया! ✅', logout: 'लॉगआउट', new_ph: 'नया प्रोजेक्ट या आदत...',
    checkin: 'आज का चेक-इन करें (+10 XP)', checkin_done: 'आज का चेक-इन हो गया ✅',
    streak_lbl: 'दिन की स्ट्रीक', xp: 'XP', progress: '📊 आपकी प्रगति',
    this_week: 'इस हफ्ते', this_month: 'इस महीने', total: 'कुल दिन', best: 'बेस्ट स्ट्रीक',
    last7: 'पिछले 7 दिन', last12: 'पिछले 12 हफ्ते (हरा = चेक-इन हुआ)',
    none: 'अभी कोई प्रोजेक्ट नहीं। ऊपर से पहला प्रोजेक्ट बनाएं 👆',
    sub_ph: 'नया सब-टास्क...', add: 'जोड़ें', del: 'यह प्रोजेक्ट हटाएं?',
    already: 'आज का चेक-इन पहले ही हो चुका है',
    rem_title: '🔔 रोज़ का रिमाइंडर', rem_time: 'समय', rem_test: 'टेस्ट',
    rem_ok: 'नोटिफिकेशन की अनुमति मिल गई ✅', rem_blocked: 'नोटिफिकेशन बंद हैं। ब्राउज़र सेटिंग में चालू करें।',
    rem_ask: 'स्विच ऑन करें और नोटिफिकेशन की अनुमति दें', rem_unsupported: 'यह ब्राउज़र नोटिफिकेशन सपोर्ट नहीं करता',
    rem_body: 'चेक-इन का समय हो गया, अपनी स्ट्रीक बनाए रखें 🔥', rem_note: 'ऐप या टैब खुला होने पर काम करता है'
  },
  hn: {
    tagline: 'Habits banao. Projects poore karo.', login: 'Login', signup: 'Sign Up',
    username: 'Username', email: 'Email', password: 'Password (kam se kam 6)',
    create: 'Account banao', wait: 'Please wait...',
    short: 'Username kam se kam 3 akshar ka rakhein',
    created: 'Account ban gaya! ✅', created_confirm: 'Account ban gaya. Email confirm karke login karein.',
    logged: 'Login ho gaya! ✅', logout: 'Logout', new_ph: 'Naya project ya habit...',
    checkin: 'Aaj ka check-in karein (+10 XP)', checkin_done: 'Aaj ka check-in ho gaya ✅',
    streak_lbl: 'Din ki streak', xp: 'XP', progress: '📊 Aapki Progress',
    this_week: 'Is hafte', this_month: 'Is mahine', total: 'Kul din', best: 'Best streak',
    last7: 'Pichhle 7 din', last12: 'Pichhle 12 hafte (hara = check-in hua)',
    none: 'Abhi koi project nahi. Upar se pehla project banayein 👆',
    sub_ph: 'Naya sub-task...', add: 'Add', del: 'Ye project delete karein?',
    already: 'Aaj ka check-in pehle hi ho chuka hai',
    rem_title: '🔔 Roz ka Reminder', rem_time: 'Time', rem_test: 'Test',
    rem_ok: 'Notifications allow ho gaye ✅', rem_blocked: 'Notifications blocked hain. Browser settings mein on karein.',
    rem_ask: 'Switch on karein aur notification allow karein', rem_unsupported: 'Ye browser notifications support nahi karta',
    rem_body: 'Check-in ka time ho gaya, apni streak bachao 🔥', rem_note: 'App ya tab khula ho tabhi kaam karta hai'
  }
};

let LANG = localStorage.getItem('archivo-lang') || 'en';
function t(k) { return (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k; }

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  document.documentElement.lang = LANG === 'hi' ? 'hi' : 'en';
  const b = document.getElementById('lang-btn');
  if (b) b.textContent = { en: 'EN', hi: 'हिं', hn: 'Hinglish' }[LANG];
}

function cycleLang() {
  LANG = LANG === 'en' ? 'hi' : LANG === 'hi' ? 'hn' : 'en';
  localStorage.setItem('archivo-lang', LANG);
  applyI18n();
  if (window.onLangChange) window.onLangChange();
}

document.addEventListener('DOMContentLoaded', applyI18n);