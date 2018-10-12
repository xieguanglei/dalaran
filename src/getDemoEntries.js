const fs = require('fs-extra');
const path = require('path');

const getDemoEntries = function ({ demo: dir, typescript }) {

    if (fs.existsSync(dir)) {

        const filesInDemo = fs.readdirSync(dir);
        const demoEntryList = filesInDemo.map(file => {
            if (path.extname(file) === '.js') {
                const baseName = path.basename(file, '.js');
                const htmlFileName = path.basename(file, '.js') + '.html';
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