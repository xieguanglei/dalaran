const path = require('path');
const KarmaServer = require('karma').Server;


const getKarmaConfig = require('./get_config_karma');

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
    headlessMode,
    testEntryPattern,
    coverageFilePattern
}) {

    const test = function (done) {
        new KarmaServer(
            getKarmaConfig({

                base,
                dist,
                suffix,

                babelPolyfill,
                react,
                typescript,

                loaders,
                plugins,

                testEntryPattern,
                coverageFilePattern,

                watchTest,
                headlessMode
            }),
            done
        ).start();
    }



    return test;
}

module.exports = getTestTask;
