const fs = require('fs-extra');
const path = require('path');

const pwd = process.cwd();

const getESLintOptions = function () {

    const option = {};

    const hasOwnConfigFile = fs.existsSync(path.join(pwd, '.eslintrc'));
    if (!hasOwnConfigFile) {
        option.configFile = path.join(__dirname, '../space/eslint-config.json');
    }

    return option;
}

module.exports = getESLintOptions;