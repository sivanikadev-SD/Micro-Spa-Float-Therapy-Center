import os
import re
import sys

base_dir = r"d:\Project\magtan\micro spa\template-name"
source_file = r"d:\Project\magtan\micro spa\index.html"

# Create Directories
os.makedirs(os.path.join(base_dir, "assets", "css"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "assets", "js", "plugins"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "assets", "images"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "assets", "fonts"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "pages"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "documentation"), exist_ok=True)

with open(source_file, "r", encoding="utf-8") as f:
    html_doc = f.read()

# CSS Extraction
style_match = re.search(r'<style>(.*?)</style>', html_doc, re.DOTALL)
if style_match:
    style_block = style_match.group(1)
    dark_mode_match = re.search(r'(\[data-theme="dark"\]\s*\{.*?\})', style_block, re.DOTALL)
    dark_mode_css = dark_mode_match.group(1) if dark_mode_match else ""
    main_css = style_block.replace(dark_mode_css, "").strip() if dark_mode_css else style_block.strip()
else:
    main_css = ""
    dark_mode_css = ""

with open(os.path.join(base_dir, "assets", "css", "style.css"), "w", encoding="utf-8") as f:
    f.write(main_css)

with open(os.path.join(base_dir, "assets", "css", "dark-mode.css"), "w", encoding="utf-8") as f:
    f.write(dark_mode_css)

with open(os.path.join(base_dir, "assets", "css", "rtl.css"), "w", encoding="utf-8") as f:
    f.write("/* RTL Styles */\n")

# JS Extraction
script_match = re.search(r'<script>(.*?)</script>', html_doc, re.DOTALL)
if script_match:
    script_block = script_match.group(1)
    js_parts = re.split(r'(// =================== (?:CALENDAR|TIME SLOTS|SIGNATURE PAD) ===================)', script_block)
    main_js = js_parts[0]
    dash_js = "".join(js_parts[1:]) if len(js_parts) > 1 else ""

    new_showPage = """function showPage(id) {
  const pageMap = {
    'home': 'index.html',
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
}"""
    main_js = re.sub(r'function showPage\(id\)\s*\{.*?\n\}', new_showPage, main_js, flags=re.DOTALL)
else:
    main_js = ""
    dash_js = ""

with open(os.path.join(base_dir, "assets", "js", "main.js"), "w", encoding="utf-8") as f:
    f.write(main_js.strip())

with open(os.path.join(base_dir, "assets", "js", "dashboard.js"), "w", encoding="utf-8") as f:
    f.write(dash_js.strip())

# Extract Header & Footer
header_match = re.search(r'(<header class="site-header" id="siteHeader">.*?</header>)', html_doc, re.DOTALL)
header = header_match.group(1) if header_match else ""

footer_match = re.search(r'(<footer class="site-footer">.*?</footer>)', html_doc, re.DOTALL)
footer = footer_match.group(1) if footer_match else ""

pages = {
    "index": "home",
    "services": "services",
    "about": "about",
    "pricing": "pricing",
    "contact": "contact",
    "login": "auth-login",
    "signup": "auth-signup",
    "dashboard": "dashboard",
}

no_header_footer = ["login", "signup", "dashboard"]

head_template = \
'''<!DOCTYPE html>
<html lang="en" data-theme="light" data-dir="ltr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Serene Float — {title}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="stylesheet" href="../assets/css/dark-mode.css">
<link rel="stylesheet" href="../assets/css/rtl.css">
</head>
<body>
'''

scripts_template = \
'''
<script src="../assets/js/main.js"></script>
{dash_script}
</body>
</html>
'''

# Identify block start markers to split pages safely
# They look like: <!-- =================== HOME PAGE =================== -->
parts = re.split(r'<!-- =================== [A-Z: ]+=================== -->\n', html_doc)

for page_file, page_id in pages.items():
    content_raw = ""
    for part in parts:
        # Check if this part contains the div for this page
        if f'id="{page_id}"' in part and 'class="page' in part:
            content_raw = part.strip()
            # If the part contains the footer, remove it to prevent duplicate footers appearing in content
            if footer in content_raw:
                content_raw = content_raw.replace(footer, "")
            break

    if not content_raw:
        print(f"Failed to find {page_id}")
        continue

    # Ensure it starts with active class
    content_raw = re.sub(r'<div id="' + page_id + '" class="page[^"]*">', f'<div id="{page_id}" class="page active">', content_raw, count=1)
    
    html_out = head_template.format(title=page_file.capitalize())
    
    if page_file not in no_header_footer:
        html_out += header + "\n"
        
    html_out += content_raw + "\n"
    
    if page_file not in no_header_footer:
        html_out += footer + "\n"
        
    dash_script = '<script src="../assets/js/dashboard.js"></script>' if page_file == 'dashboard' else ''
    html_out += scripts_template.format(dash_script=dash_script)
    
    with open(os.path.join(base_dir, "pages", f"{page_file}.html"), "w", encoding="utf-8") as f:
        f.write(html_out)

with open(os.path.join(base_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write("# Serene Float Template\n")

print("Template split completed!")
