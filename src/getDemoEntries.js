const fs = require('fs-extra');
const path = require('path');

const getDemoEntries = function ({ demo: dir, typescript }) {

    if (fs.existsSync(dir)) {

        const extName = typescript ? '.js' : '.js';

        const filesInDemo = fs.readdirSync(dir);
        const demoEntryList = filesInDemo.map(file => {
            if (path.extname(file) === extName) {
                const baseName = path.basename(file, extName);
                const htmlFileName = path.basename(file, extName) + '.html';
                if (filesInDemo.indexOf(htmlFileName) !== -1) {
                    return baseName;
                }
            }
            return null;
        }).filter(Boolean);

        return demoEntryList;

    } else {

        return null;
    }
}

module.exports = getDemoEntries;