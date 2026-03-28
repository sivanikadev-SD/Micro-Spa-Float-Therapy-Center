// =================== PAGE NAVIGATION ===================
function showPage(id) {
  const pageMap = {
    'home': '../index.html',
    'services': 'services.html',
    'about': 'about.html',
    'pricing': 'pricing.html',
    'contact': 'contact.html',
    'auth-login': 'login.html',
    'auth-signup': 'signup.html',
    'dashboard': 'dashboard.html'
  };
  if (pageMap[id]) {
    window.location.href = pageMap[id];
  }
}

// =================== DASHBOARD PANELS ===================
function showPanel(id) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dash-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  const titles = {
    overview: 'Client Dashboard', booking: 'Book a Session',
    history: 'Wellness History', membership: 'My Membership',
    waiver: 'Digital Waivers', profile: 'Profile & Preferences',
    notifications: 'Notifications'
  };
  document.getElementById('dashTitle').textContent = titles[id] || 'Dashboard';
  event.currentTarget && event.currentTarget.classList.add('active');
  // Try activating button that called this
  document.querySelectorAll('.dash-nav-link').forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + id + "'")) {
      btn.classList.add('active');
    }
  });
}

// =================== THEME TOGGLE ===================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeIcon').innerHTML = isDark
    ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
    : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
}

// =================== RTL TOGGLE ===================
function toggleRTL() {
  const html = document.documentElement;
  const isRTL = html.getAttribute('data-dir') === 'rtl';
  html.setAttribute('data-dir', isRTL ? 'ltr' : 'rtl');
  html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
}

// =================== PASSWORD TOGGLE ===================
function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// =================== SCROLL HEADER ===================
window.addEventListener('scroll', () => {
  document.getElementById('siteHeader').classList.toggle('scrolled', window.scrollY > 20);
});
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function handleLogout() {
  showToast("Successfully logged out. Redirecting...");
  setTimeout(() => { showPage("home"); }, 1200);
}

// =================== MOBILE MENU TOGGLES ===================
document.addEventListener('DOMContentLoaded', () => {
  const navInner = document.querySelector('.nav-inner');
  if (navInner && !document.querySelector('.mobile-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'icon-btn mobile-toggle';
    toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';

    const navActions = document.querySelector('.nav-actions');
    if (navActions) navInner.insertBefore(toggleBtn, navActions);
    else navInner.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.toggle('mobile-open');
    });
  }

  const dashTopbarRight = document.querySelector('.dash-topbar-right');
  const dashSidebar = document.querySelector('.dash-sidebar');
  if (dashTopbarRight && dashSidebar && !document.querySelector('.dash-mobile-toggle')) {
    const dashToggleBtn = document.createElement('button');
    dashToggleBtn.className = 'icon-btn dash-mobile-toggle';
    dashToggleBtn.style.marginRight = 'auto'; // Push title right
    dashToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';

    const dashTopbar = document.querySelector('.dash-topbar');
    dashTopbar.insertBefore(dashToggleBtn, dashTopbar.firstChild);

    dashToggleBtn.addEventListener('click', () => {
      dashSidebar.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.dash-nav-link').forEach(link => {
      link.addEventListener('click', () => dashSidebar.classList.remove('mobile-open'));
    });
  }
});
