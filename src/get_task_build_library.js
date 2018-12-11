const getTaskBuild = require('./get_task_build');

function getTaskBuildLibrary({

    entry,
    base,
    dist,

    umdName,
    suffix: buildSuffix,
    libExternals,

    minify,

    loaders,
    plugins,

    babelPolyfill,
    typescript,
    react,

}) {

    return function (done) {

        const build = getTaskBuild({

            entry,
            base,
            dist,

            umdName,
            suffix: buildSuffix,
            libExternals,

            minify,

            loaders,
            plugins,

            babelPolyfill,
            typescript,
            react,
        });

        build(done);
    }
}


module.exports = getTaskBuildLibrary;
