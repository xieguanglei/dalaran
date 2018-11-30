const fs = require('fs-extra');
const path = require('path');

const getESLintOptions = function ({ lintrcDir }) {

    const option = {};

    const hasOwnConfigFile = fs.existsSync(path.join(lintrcDir, '.eslintrc'));
    if (hasOwnConfigFile) {
        option.configFile = path.join(lintrcDir, '.eslintrc');
    } else {
        option.configFile = path.join(__dirname, '../space/eslint-config.json');
    }

    return option;
}

module.exports = getESLintOptions;