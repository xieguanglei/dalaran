const path = require('path');

const getAddTask = require('./get_task_add');
const getDevTask = require('./get_task_dev');
const getBuildTask = require('./get_task_build_application');
const getTestTask = require('./get_task_test');



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

    const dev = getDevTask({

        base,
        demo,
        devSuffix,

        port,
        devCors,
        liveReload,

        babelPolyfill,
        react,
        typescript,

        lint,
        lintrcDir,

        loaders,
        plugins,
    });

    const build = getBuildTask({
        
        demo,
        base,
        dist,
        suffix: buildSuffix,

        minify,

        babelPolyfill,
        typescript,
        react,

        loaders,
        plugins,

        publicPath
    });

    const test = getTestTask({
        base,
        dist,
        suffix: buildSuffix,
        loaders,
        plugins,
        babelPolyfill,
        react,
        typescript,
        testEntryPattern,
        watchTest,
    });

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