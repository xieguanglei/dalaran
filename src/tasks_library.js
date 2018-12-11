const path = require('path');

const getAddTask = require('./get_task_add');
const getDevTask = require('./get_task_dev');
const getBuildTask = require('./get_task_build_library');
const getTestTask = require('./get_task_test');


const libraryTasks = function (
    {

        base = process.cwd(),
        entry = './src/index.js',

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
        libExternals = [],

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
        suffix: devSuffix
    });

    return {
        dev,
        build,
        test,
        add
    }
}

module.exports = libraryTasks;