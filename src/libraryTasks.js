const path = require('path');

const log = require('fancy-log');
const glob = require('glob');
const fs = require('fs-extra');

const babel = require('@babel/core');

const KarmaServer = require('karma').Server;

const getWebpackConfig = require('./getWebpackConfig');
const getBabelOptions = require('./getBabelOptions');
const getDemoEntries = require('./getDemoEntries');

const getAddTask = require('./taskAdd');
const getDevTask = require('./taskDev');


const webpack = require('webpack');

const libraryTasks = function (
    {

        base = process.cwd(),
        entry = './src/index.js',
        src = './src',

        // for dev
        demo = './demo',
        devSuffix = 'bundle',
        port = 3000,
        devCors = true,
        liveReload = false,

        // for build
        dist = './dist',
        umdName = 'Unnamed',
        buildSuffix = 'min',
        minify = true,

        // for compile
        lib = './lib',

        // for test
        testEntryPattern = 'src/**/*.spec.js',
        watchTest = false,

        // for add
        htmlTemplate = path.resolve(__dirname, '../space/html-template.handlebars'),
        jsTemplate = path.resolve(__dirname, '../space/js-template.handlebars'),

        // configs

        babelPolyfill = false,
        typescript = false,
        react = false,

        lint = false,

        loaders = [],
        plugins = [],

    } = {}
) {

    const demoEntryList = getDemoEntries({ demo, typescript });
    const babelOptions = getBabelOptions({ react, typescript });

    const dev = demoEntryList ? getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions,
            loaders,
            plugins,
            babelPolyfill,
            commonsChunk: false,
            react,
            lint,
            liveReload,
            typescript,
        }),
        demo,
        port,
        devCors,
        demoEntryList
    }) : function () {
        log.error(`Warning : There's no demo entries in directory ${demo}, the dev task does nothing.`);
    };

    const noop = () => { };

    const build = function (done = noop) {

        fs.emptyDirSync(dist);

        webpack(
            getWebpackConfig({
                entry,
                base,
                umdName,
                dist,
                suffix: buildSuffix,
                babelOptions,
                minify,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk: false,
                lint,
                typescript,
            }),
            (err, stats) => {
                if (err) {
                    throw err;
                }
                if (stats.hasErrors()) {
                    throw stats.toJson().errors;
                }
                log('Build Success');
                done();
            }
        )
    };

    const compile = function (done = noop) {

        if (typescript) {
            throw new Error('Compile task not support for typescript projects.');
        }
        if (loaders.length !== 0) {
            throw new Error('Compile task not support extra loaders');
        }

        fs.emptyDirSync(lib);
        const files = glob.sync(src + '/**/*.js');
        files.filter(file => !file.endsWith('spec.js')).forEach(function (file) {
            const res = babel.transformFileSync(file, babelOptions);
            const target = file.replace(src, lib);
            fs.outputFileSync(target, res.code, 'utf-8');
        });

        done();
    }

    const test = function (done) {
        new KarmaServer({
            configFile: path.join(__dirname, '../space/karma.conf.js'),
            testEntryPattern,
            singleRun: watchTest ? false : true,
            webpack: getWebpackConfig({
                base,
                umdName,
                dist,
                suffix: buildSuffix,
                babelOptions,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk: false,
                lint: false,
                typescript,
            }),
            webpackMiddleware: {
                quiet: true
            }
        }, done).start();
    }

    const add = getAddTask({
        demo,
        htmlTemplate,
        jsTemplate,
        liveReload,
        suffix: devSuffix,
        commonsChunk: false
    });

    return {
        dev,
        build,
        compile,
        test,
        add
    }
}

module.exports = libraryTasks;