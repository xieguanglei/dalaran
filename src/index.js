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
        flow = false,
        react = false,

        eslint = false,

        loaders = [],
        plugins = [],

    } = {}
) {

    const demoEntryList = getDemoEntries(demo);
    const babelOptions = getBabelOptions({ react, flow });

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
            eslint,
            liveReload,
            flow,
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
                eslint,
                flow,
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    throw new Error(err || stats.hasErrors())
                }
                log('Build Success');
                done();
            }
        )
    };

    const compile = function (done = noop) {
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
                eslint: false
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


const applicationTasks = function (

    {

        base = process.cwd(),

        // for dev
        demo = './demo',
        devSuffix = 'bundle',
        port = 3000,
        devCors = true,
        liveReload = false,

        // for build
        dist = './dist',
        buildSuffix = 'bundle',
        minify = true,
        publicPath = './',

        // for test
        testEntryPattern = 'src/**/*.spec.js',
        watchTest = false,

        // for add
        htmlTemplate = path.resolve(__dirname, '../space/html-template.handlebars'),
        jsTemplate = path.resolve(__dirname, '../space/js-template.handlebars'),

        // config
        babelPolyfill = false,
        flow = false,
        react = false,

        commonsChunk = true,
        eslint = false,

        loaders = [],
        plugins = [],

    } = {}
) {

    const demoEntryList = getDemoEntries(demo);
    const babelOptions = getBabelOptions({ react, flow });

    const dev = getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions,
            flow,
            react,
            loaders,
            plugins,
            babelPolyfill,
            commonsChunk,
            eslint,
            liveReload
        }),
        demo,
        port,
        devCors,
        demoEntryList
    });

    const build = function (done = () => { }) {

        fs.emptyDirSync(dist);

        webpack(
            getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                dist,
                suffix: buildSuffix,
                babelOptions,
                minify,
                flow,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk,
                publicPath,
                eslint
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    throw new Error(err || stats.hasErrors())
                }
                copyHTMLs();
                log('Build Success');
                done();
            }
        )

        function copyHTMLs() {
            const htmlFiles = glob.sync(demo + '/*.html');

            htmlFiles.forEach(file => {

                const content = fs.readFileSync(file, 'utf-8');
                const baseName = path.basename(file);

                const modifiedContent = content.replace(/__TIMESTAMP__/g, 'timestamp=' + Date.now())
                    .replace(/<script src=\".+livereload.js\"><\/script>/g, '');

                fs.outputFile(dist + `/${baseName}`, modifiedContent);
            });
        }
    }

    const test = function (done) {
        console.log(demoEntryList);
        new KarmaServer({
            configFile: path.join(__dirname, '../space/karma.conf.js'),
            testEntryPattern,
            singleRun: watchTest ? false : true,
            webpack: getWebpackConfig({
                base,
                dist,
                suffix: buildSuffix,
                babelOptions,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk: false,
                eslint: false
            }),
            webpackMiddleware: {}
        }, done).start();
    }

    const add = getAddTask({
        demo,
        htmlTemplate,
        jsTemplate,
        liveReload,
        suffix: devSuffix,
        commonsChunk
    });

    return { dev, build, test, add };
}


module.exports = { libraryTasks, applicationTasks };