import os
base_dir = r"d:\Project\magtan\micro spa\template-name"
css_file = os.path.join(base_dir, "assets", "css", "style.css")
js_file = os.path.join(base_dir, "assets", "js", "main.js")

css_toast = """
#toast-notification {
  position: fixed; bottom: 32px; right: 32px;
  background: var(--surface); color: var(--text);
  padding: 14px 28px; border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg); border: 1px solid var(--border);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  z-index: 9999; transform: translateY(150px) scale(0.9);
  opacity: 0; transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: var(--font-body); font-weight: 500; font-size: 14px;
  pointer-events: none;
}
#toast-notification.show { transform: translateY(0) scale(1); opacity: 1; }
"""

with open(css_file, "a", encoding="utf-8") as f:
    f.write(css_toast)

js_toast = """
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
"""

with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

if "showToast" not in js_content:
    with open(js_file, "a", encoding="utf-8") as f:
        f.write(js_toast)
