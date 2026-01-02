const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');

// Add ad container div before </body> if not exists
const adContainer = `
<!-- Ad Container -->
<div style="margin: 2rem auto; max-width: 728px; text-align: center;" id="ad-container"></div>
`;

function addAdContainer(content) {
    // Skip if already has ad-container
    if (content.includes('id="ad-container"')) {
        return content;
    }

    // Add before </body>
    content = content.replace('</body>', adContainer + '</body>');
    return content;
}

// Process tools folder
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    content = addAdContainer(content);

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Added container: ${file}`);
        updated++;
    } else {
        console.log(`Skipped: ${file}`);
        skipped++;
    }
});

// Also update main index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
const originalIndex = indexContent;
indexContent = addAdContainer(indexContent);
if (indexContent !== originalIndex) {
    fs.writeFileSync(indexPath, indexContent);
    console.log('Added container: index.html (main)');
    updated++;
} else {
    console.log('Skipped: index.html (main)');
}

console.log(`\n✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
