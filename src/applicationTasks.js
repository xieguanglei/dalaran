const path = require('path');



const glob = require('glob');
const fs = require('fs-extra');


const KarmaServer = require('karma').Server;

const getWebpackConfig = require('./getWebpackConfig');
const getBabelOptions = require('./getBabelOptions');
const getDemoEntries = require('./getDemoEntries');

const getAddTask = require('./taskAdd');
const getDevTask = require('./taskDev');


const webpack = require('webpack');


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
        typescript = false,
        react = false,

        commonsChunk = true,
        lint = false,
        lintrcDir = process.cwd(),

        loaders = [],
        plugins = [],

    } = {}
) {

    const demoEntryList = getDemoEntries({ demo, typescript });
    const babelOptions = getBabelOptions({ react, typescript });

    const dev = getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions,
            typescript,
            react,
            loaders,
            plugins,
            babelPolyfill,
            commonsChunk,
            lint,
            lintrcDir,
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
                typescript,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk,
                publicPath,
                lint,
                lintrcDir,
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    throw new Error(err || stats.hasErrors())
                }
                copyHTMLs();
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
                lint: false,
                typescript
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

module.exports = applicationTasks;