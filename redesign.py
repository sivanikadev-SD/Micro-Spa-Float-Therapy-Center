import os
import re

base_dir = r"d:\Project\magtan\micro spa"
template_dir = os.path.join(base_dir, "template-name")
css_file = os.path.join(template_dir, "assets", "css", "style.css")
dark_css_file = os.path.join(template_dir, "assets", "css", "dark-mode.css")
js_file = os.path.join(template_dir, "assets", "js", "main.js")
root_html = os.path.join(base_dir, "index.html")

# 1. New CSS Variables
new_vars = """
:root {
  --primary: #1F3A4A;
  --primary-dark: #0F2027;
  --secondary: #6E8FA3;
  --secondary-light: #B8CCD6;
  --accent-glow: #5FA8D3;
  --bg: #DCEFF5;
  --bg-alt: #B8CCD6;
  --surface: rgba(255, 255, 255, 0.4);
  --text: #1F3A4A;
  --text-muted: #4A6B7C;
  --text-light: #6E8FA3;
  --border: rgba(255, 255, 255, 0.4);
  --success: #9CAF9C;
  --warning: #C7C9C7;
  --error: #C0645A;
  --radius: 16px;
  --radius-sm: 12px;
  --shadow: 0 8px 32px rgba(31, 58, 74, 0.05);
  --shadow-lg: 0 16px 48px rgba(31, 58, 74, 0.1);
  --glow: 0 0 20px rgba(95, 168, 211, 0.6);
  --transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --nav-h: 76px;
}
"""

dark_mode_vars = """
[data-theme="dark"] {
  --bg: #0F2027;
  --bg-alt: #162C36;
  --surface: rgba(32, 58, 67, 0.4);
  --text: #DCEFF5;
  --text-muted: #9CAF9C;
  --text-light: #6E8FA3;
  --border: rgba(95, 168, 211, 0.15);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.7);
  --glow: 0 0 24px rgba(95, 168, 211, 0.4);
}
"""

old_font = r'<link href="https://fonts.googleapis.com/css2\?family=Cormorant\+Garamond.*?rel="stylesheet"/>'
new_font = '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&family=Poppins:wght@300;400&display=swap" rel="stylesheet"/>'

pages_dir = os.path.join(template_dir, "pages")
if os.path.exists(pages_dir):
    for filename in os.listdir(pages_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(pages_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            content = re.sub(old_font, new_font, content)
            
            # Dashboard dark mode enforcement
            if filename == "dashboard.html":
                content = content.replace('data-theme="light"', 'data-theme="dark"')
                
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

# Glassmorphism and animations
glass_rule = """
/* Glassmorphism Classes */
.service-card, .pricing-card, .auth-card, .dash-sidebar, .dash-topbar, .dash-card, .calendar-widget, .time-slots, .membership-card, .waiver-card, .testimonial {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: var(--surface);
  border: 1px solid var(--border);
}

.site-header { 
  background: rgba(220, 239, 245, 0.6) !important; 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px); 
}
[data-theme="dark"] .site-header { 
  background: rgba(15, 32, 39, 0.7) !important; 
}

/* Animations and Glow */
.btn-primary { 
  box-shadow: var(--shadow); 
  transition: all 0.5s ease;
}
.btn-primary:hover { 
  box-shadow: var(--glow); 
  transform: translateY(-2px);
}

/* Water Ripple Hover effect */
.service-card:hover, .pricing-card:hover, .dash-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(95, 168, 211, 0.15);
  border-color: rgba(95, 168, 211, 0.4);
}
[data-theme="dark"] .dash-card, [data-theme="dark"] .card-gradient {
  background: linear-gradient(135deg, #203A43, #2C5364);
}
"""

if os.path.exists(root_html):
    with open(root_html, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(old_font, new_font, content)
    content = re.sub(r':root\s*\{.*?\}', new_vars.strip(), content, flags=re.DOTALL)
    content = re.sub(r'\[data-theme="dark"\]\s*\{.*?\}', dark_mode_vars.strip(), content, flags=re.DOTALL)
    
    if "backdrop-filter: blur(16px);" not in content:
        content = content.replace("</style>", glass_rule + "\n</style>")
        
    dash_toggle = "if (id === 'dashboard') { document.documentElement.setAttribute('data-theme', 'dark'); } else { document.documentElement.setAttribute('data-theme', 'light'); }"
    if "document.getElementById(id).classList.add('active');" in content and dash_toggle not in content:
        content = content.replace("document.getElementById(id).classList.add('active');", f"document.getElementById(id).classList.add('active'); {dash_toggle}")
        
    with open(root_html, "w", encoding="utf-8") as f:
        f.write(content)

if os.path.exists(css_file):
    with open(css_file, "r", encoding="utf-8") as f:
        css_content = f.read()

    css_content = re.sub(r':root\s*\{.*?\}', new_vars.strip(), css_content, flags=re.DOTALL)

    if "backdrop-filter: blur(16px);" not in css_content:
        css_content += glass_rule

    with open(css_file, "w", encoding="utf-8") as f:
        f.write(css_content)

if os.path.exists(dark_css_file):
    with open(dark_css_file, "w", encoding="utf-8") as f:
        f.write(dark_mode_vars.strip())

print("Redesign Success!")
