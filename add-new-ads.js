const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const newAdScript = `<script src="https://quge5.com/88/tag.min.js" data-zone="198117" async data-cfasync="false"></script>`;

// Process tools folder
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

files.forEach(file => {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('quge5.com') || content.includes('198117')) {
        console.log(`Skipped: ${file}`);
        skipped++;
        return;
    }

    // Add new ad script before </head>
    content = content.replace('</head>', newAdScript + '\n</head>');

    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
    updated++;
});

// Also update main index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('quge5.com')) {
    indexContent = indexContent.replace('</head>', newAdScript + '\n</head>');
    fs.writeFileSync(indexPath, indexContent);
    console.log('Updated: index.html (main)');
    updated++;
} else {
    console.log('Skipped: index.html (main)');
}

console.log(`\n✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
