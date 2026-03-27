import os

base_dir = r"d:\Project\magtan\micro spa\template-name"
js_file = os.path.join(base_dir, "assets", "js", "main.js")

mobile_js = """
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
"""

with open(js_file, "r", encoding="utf-8") as f:
    content = f.read()

if "MOBILE MENU TOGGLES" not in content:
    with open(js_file, "a", encoding="utf-8") as f:
        f.write(mobile_js)
