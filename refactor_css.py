import os
import re

css_path = r"c:\Users\jeanp\Desktop\Profolio\styles.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Colors to variables
colors = {
    r'#1a1b26': 'var(--bg-main)',
    r'#16161e': 'var(--bg-dark)',
    r'#24283b': 'var(--bg-card)',
    r'#7aa2f7': 'var(--accent-primary)',
    r'#bb9af7': 'var(--accent-secondary)',
    r'#c0caf5': 'var(--text-main)',
    r'#9aa5ce': 'var(--text-muted)',
    r'#f7768e': 'var(--error-color)',
    r'#3d59a1': 'var(--accent-hover)'
}

for hex_c, var_n in colors.items():
    # Case insensitive replacement
    css = re.sub(re.compile(hex_c, re.IGNORECASE), var_n, css)

# 2. Font family
css = re.sub(r"font-family:\s*['\"]?Roboto['\"]?,\s*sans-serif;", "font-family: var(--font-primary);", css)

# 3. Clean empty rules to fix lints.
# Example: html { scroll-padding-top ya no es necesario con la barra lateral en escritorio } which is basically an empty rule if it only has comments
# Just removing explicit empty rule: html { }
css = re.sub(r'html\s*\{\s*\}', '', css)
css = re.sub(r'([^\}\n]+)\s*\{\s*\}', '', css)

# 4. Insert Root vars
root_vars = """@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

:root {
    --bg-main: #1a1b26;
    --bg-dark: #16161e;
    --bg-card: rgba(36, 40, 59, 0.4); /* Backdrop glass */
    --accent-primary: #7aa2f7;
    --accent-secondary: #bb9af7;
    --text-main: #c0caf5;
    --text-muted: #9aa5ce;
    --error-color: #f7768e;
    --accent-hover: #3d59a1;
    --glass-border: rgba(255, 255, 255, 0.05);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    --font-primary: 'Outfit', sans-serif;
}

"""
css = root_vars + css

# 5. Append Glassmorphism Overrides
glass_styles = """
/* --- EFECTOS GLASSMORPHISM --- */
.job-entry, .edu-entry, .skills-group, .project-card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
}
"""

css += glass_styles

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Refactorización CSS exitosa.")
