const path = require('path');
const KarmaServer = require('karma').Server;

const getWebpackConfig = require('./get_config_webpack');

function getTestTask({
    base,
    dist,
    suffix,

    babelPolyfill,
    react,
    typescript,

    loaders,
    plugins,

    watchTest,
    testEntryPattern
}) {

    const test = function (done) {
        new KarmaServer({
            configFile: path.join(__dirname, '../space/karma.conf.js'),
            testEntryPattern,
            singleRun: watchTest ? false : true,
            webpack: getWebpackConfig({

                base,
                dist,
                suffix,

                babelPolyfill,
                react,
                typescript,

                loaders,
                plugins,

                lint: false,
                lintrcDir: './'
            }),
            webpackMiddleware: {
                quiet: true
            }
        }, done).start();
    }

    return test;
}

module.exports = getTestTask;
