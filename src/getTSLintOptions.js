const fs = require('fs-extra');
const path = require('path');

const pwd = process.cwd();

const getTSLintOptions = function () {

    const option = {};

    const hasOwnConfigFile = fs.existsSync(path.join(pwd, '.tslintrc'));
    if (!hasOwnConfigFile) {
        option.configFile = path.join(__dirname, '../space/tslint-config.json');
    }

    return option;
}

module.exports = getTSLintOptions;