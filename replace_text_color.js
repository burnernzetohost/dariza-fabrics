const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components', 'lib'];
const exts = ['.tsx', '.ts', '.css'];

const replacements = [
    { from: /text-black/g, to: 'text-[#01321F]' },
    { from: /text-\[#000000\]/g, to: 'text-[#01321F]' },
    { from: /text-gray-900/g, to: 'text-[#01321F]' },
    { from: /--foreground: #171717;/g, to: '--foreground: #01321F;' }
];

function walkSync(dir, filelist = []) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return filelist;
    }
    files.forEach(function (file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (exts.some(ext => file.endsWith(ext))) {
                filelist.push(filepath);
            }
        }
    });
    return filelist;
}

let changedCount = 0;

for (const dir of dirs) {
    const fullDir = path.join(__dirname, dir);
    const files = walkSync(fullDir);

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;

        for (const replacement of replacements) {
            newContent = newContent.replace(replacement.from, replacement.to);
        }

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated:', file);
            changedCount++;
        }
    }
}

console.log(`Total files updated: ${changedCount}`);
