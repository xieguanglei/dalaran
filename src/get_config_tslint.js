const fs = require('fs-extra');
const path = require('path');


const getTSLintOptions = function ({ lintrcDir }) {

    const option = {};
    const hasOwnConfigFile = fs.existsSync(path.join(lintrcDir, 'tslint.json'));

    if (hasOwnConfigFile) {
        option.configFile = path.join(lintrcDir, 'tslint.json');
    } else {
        option.configFile = path.join(__dirname, '../space/tslint-config.json');
    }

    return option;
}

module.exports = getTSLintOptions;