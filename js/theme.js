const Theme = {
  get() {
    return localStorage.getItem('archivo-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  },
  apply(t) {
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem('archivo-theme', t);
  },
  toggle() {
    this.apply(this.get() === 'dark' ? 'light' : 'dark');
  }
};
Theme.apply(Theme.get());