const fs = require('fs-extra');
const webpack = require('webpack');

const getWebpackConfig = require('./get_config_webpack');

function getTaskBuild({

    entry, umdName,
    libExternals,

    entrys, demo,

    base,
    dist,

    suffix: buildSuffix,

    minify,

    loaders,
    plugins,

    babelPolyfill,
    typescript,
    react,

    publicPath,

}) {

    const build = function (done) {

        fs.emptyDirSync(dist);

        webpack(
            getWebpackConfig({
                base,

                entry, umdName, libExternals, // for build library
                entrys, demo,   // for build application

                dist,
                suffix: buildSuffix,
                minify,
                loaders,
                plugins,
                babelPolyfill,
                typescript,
                react,
                publicPath,

                lint: false,
                lintrcDir: './',

                sourcemap: false
            }),
            (err, stats) => {
                if (err) {
                    throw err;
                }
                if (stats.hasErrors()) {
                    throw stats.toJson().errors;
                }
                done && done();
            }
        )
    }

    return build;
}

module.exports = getTaskBuild;
