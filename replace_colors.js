const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components', 'lib'];
const exts = ['.tsx', '.ts', '.css'];

const replacements = [
    { from: /#012d20/gi, to: '#000000' },
    { from: /#001a12/gi, to: '#1a1a1a' },
    { from: /#DCf9f1/gi, to: '#ffffff' }
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
