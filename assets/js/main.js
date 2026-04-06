// =================== PAGE NAVIGATION ===================
function showPage(id) {
  const pageMap = {
    'home': '../index.html',
    'home-v2': 'home-v2.html',
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
  // Try activating button that called this
  const target = event && event.currentTarget;
  if (target) target.classList.add('active');
  document.querySelectorAll('.dash-nav-link').forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + id + "'")) {
      btn.classList.add('active');
    }
  });
}

// =================== GLOBAL PERSISTENCE ===================
function initSettings() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  const savedDir = localStorage.getItem('dir') || 'ltr';
  
  html.setAttribute('data-theme', savedTheme);
  html.setAttribute('data-dir', savedDir);
  html.setAttribute('dir', savedDir);

  // Update theme icon if on page with theme toggle
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    const isDark = savedTheme === 'dark';
    themeIcon.innerHTML = isDark
      ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}
// Run immediately on script load
initSettings();

// =================== THEME TOGGLE ===================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.innerHTML = !isDark
      ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
}

// =================== RTL TOGGLE ===================
function toggleRTL() {
  const html = document.documentElement;
  const isRTL = html.getAttribute('data-dir') === 'rtl';
  const newDir = isRTL ? 'ltr' : 'rtl';
  
  html.setAttribute('data-dir', newDir);
  html.setAttribute('dir', newDir);
  localStorage.setItem('dir', newDir);
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
    toggleBtn.setAttribute('aria-label', 'Toggle menu');
    toggleBtn.setAttribute('aria-expanded', 'false');

    const hamburgerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    const closeIcon     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    toggleBtn.innerHTML = hamburgerIcon;

    // Append after nav-links so it sits at the end inside flex
    navInner.appendChild(toggleBtn);

    const navLinks = document.querySelector('.nav-links');

    function closeMobileNav() {
      navLinks.classList.remove('mobile-open');
      toggleBtn.innerHTML = hamburgerIcon;
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Reset all open dropdowns
      navLinks.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggleBtn.innerHTML = isOpen ? closeIcon : hamburgerIcon;
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) {
        navLinks.querySelectorAll('.nav-item.dropdown.open').forEach(item => item.classList.remove('open'));
      }
    });

    if (navLinks) {
      // Close drawer when a regular link is clicked
      navLinks.querySelectorAll('a:not(.dropdown-toggle):not(.dropdown-link)').forEach(link => {
        link.addEventListener('click', closeMobileNav);
      });
      // Close drawer when a dropdown-link is clicked
      navLinks.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
      });

      // Mobile accordion: toggle .open on the parent nav-item when dropdown-toggle is clicked
      navLinks.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          // Only intercept in mobile/tablet view (hamburger is visible)
          if (window.innerWidth <= 900) {
            e.preventDefault();
            const navItem = toggle.closest('.nav-item.dropdown');
            if (navItem) navItem.classList.toggle('open');
          }
        });
      });
    }
  }

  const dashTopbarRight = document.querySelector('.dash-topbar-right');
  const dashSidebar = document.querySelector('.dash-sidebar');
  if (dashTopbarRight && dashSidebar && !document.querySelector('.dash-mobile-toggle')) {
    const dashToggleBtn = document.createElement('button');
    dashToggleBtn.className = 'icon-btn dash-mobile-toggle';
    // dashToggleBtn.style.marginRight = 'auto'; // Removed to avoid title push
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

// =================== FAQ ACCORDION ===================
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
