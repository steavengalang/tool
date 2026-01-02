const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const adScript = `
<script async data-cfasync="false" src="//pl26337722.profitableratecpm.com/9e9c37cd5691a7c93e85d71a0b2c3f62/invoke.js"></script>
<div id="container-9e9c37cd5691a7c93e85d71a0b2c3f62" style="margin: 2rem auto; max-width: 728px;"></div>
`;

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('profitableratecpm') || content.includes('monetag')) {
        console.log(`Skipped: ${file}`);
        skipped++;
        return;
    }

    // Add ad before </body>
    content = content.replace('</body>', adScript + '</body>');

    // Add SEO meta if missing
    if (!content.includes('meta name="description"')) {
        const title = file.replace('.html', '').replace(/-/g, ' ');
        const metaDesc = `<meta name="description" content="${title} - Free online tool by ToolsKita">`;
        content = content.replace('<head>', '<head>\n  ' + metaDesc);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
});

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
