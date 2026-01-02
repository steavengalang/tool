const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');

// Enhanced tool template with better UI
function improveToolHTML(content, filename) {
    const toolName = filename.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Skip if already improved
    if (content.includes('tool-improved-v2')) return content;

    // Add viewport and charset if missing
    if (!content.includes('viewport')) {
        content = content.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }

    // Add description meta if missing
    if (!content.includes('meta name="description"')) {
        content = content.replace('<head>', `<head>\n  <meta name="description" content="${toolName} - Free online tool by ToolsKita">`);
    }

    // Add improved styles for tool pages
    const improvedStyles = `
  <!-- tool-improved-v2 -->
  <style>
    .copy-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px); background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 12px 24px; border-radius: 12px; font-weight: 600; opacity: 0; transition: all 0.3s ease; z-index: 9999; box-shadow: 0 10px 40px rgba(34, 197, 94, 0.4); }
    .copy-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .btn { position: relative; overflow: hidden; }
    .btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent); opacity: 0; transition: opacity 0.3s; }
    .btn:hover::after { opacity: 1; }
    .btn:active { transform: scale(0.98); }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-secondary, #a1a1a1); }
    input[type="text"], input[type="number"], textarea, select { transition: all 0.3s ease; }
    input[type="text"]:focus, input[type="number"]:focus, textarea:focus, select:focus { border-color: var(--accent, #d4ff3a) !important; box-shadow: 0 0 0 3px rgba(212, 255, 58, 0.2) !important; outline: none; }
    .password-display, .result-display { display: flex; gap: 0.5rem; align-items: stretch; }
    .password-display input, .result-display input, .result-display textarea { flex: 1; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .loading { animation: pulse 1.5s infinite; }
  </style>
  <script>
    function showToast(msg = 'Copied!') {
      let toast = document.querySelector('.copy-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
    function copyText(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('Copied!')).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }
    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied!');
    }
  </script>`;

    // Insert improved styles before </head>
    content = content.replace('</head>', improvedStyles + '\n</head>');

    // Replace old alert-based copy with modern toast
    content = content.replace(/alert\(['"].*copied.*['"]\)/gi, "showToast('Copied!')");
    content = content.replace(/alert\(['"].*copy.*['"]\)/gi, "showToast('Copied!')");
    content = content.replace(/alert\(['"]Copied.*['"]\)/gi, "showToast('Copied!')");
    content = content.replace(/alert\(['"]Password copied.*['"]\)/gi, "showToast('Password copied!')");
    content = content.replace(/alert\(['"]Text copied.*['"]\)/gi, "showToast('Text copied!')");
    content = content.replace(/alert\(['"]Link copied.*['"]\)/gi, "showToast('Link copied!')");
    content = content.replace(/alert\(['"]Code copied.*['"]\)/gi, "showToast('Code copied!')");
    content = content.replace(/alert\(['"]CSS copied.*['"]\)/gi, "showToast('CSS copied!')");
    content = content.replace(/alert\(['"]HTML copied.*['"]\)/gi, "showToast('HTML copied!')");
    content = content.replace(/alert\(['"]JSON copied.*['"]\)/gi, "showToast('JSON copied!')");
    content = content.replace(/alert\(['"]Result copied.*['"]\)/gi, "showToast('Result copied!')");
    content = content.replace(/alert\(['"]URL copied.*['"]\)/gi, "showToast('URL copied!')");
    content = content.replace(/alert\(['"]Hash copied.*['"]\)/gi, "showToast('Hash copied!')");
    content = content.replace(/alert\(['"]UUID copied.*['"]\)/gi, "showToast('UUID copied!')");

    // Replace document.execCommand copy with modern clipboard API where possible
    content = content.replace(
        /document\.execCommand\(['"]copy['"]\);\s*alert\([^)]+\)/g,
        "copyText(document.querySelector('input, textarea').value)"
    );

    return content;
}

// Process all tool files
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
let improved = 0;
let skipped = 0;

files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('tool-improved-v2')) {
        console.log(`Skipped: ${file}`);
        skipped++;
        return;
    }

    const newContent = improveToolHTML(content, file);
    fs.writeFileSync(filePath, newContent);
    console.log(`Improved: ${file}`);
    improved++;
});

console.log(`\n✅ Done! Improved: ${improved}, Skipped: ${skipped}`);
