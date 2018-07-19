const gulp = require('gulp');
const log = require('fancy-log');
const express = require('express');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevMiddleware = require('webpack-dev-middleware');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const babel = require('babel-core');
const glob = require('glob');
const cors = require('cors');
const KarmaServer = require('karma').Server;
const open = require('open');
const Handlebars = require('handlebars');
const replace = require('gulp-replace');
const gulpESLint = require('gulp-eslint');
const mergeStream = require('merge-stream');

const pwd = process.cwd();


const getWebpackConfig = function ({ entrys, entry, base, demo, dist, babelOptions, umdName, suffix, minify, react,
    loaders: extraLoaders, plugins: extraPlugins, babelPolyfill: useBabelPolyfill, commonsChunk, publicPath, eslint, liveReload }) {

    const entryConfig = {};
    const outputConfig = {
        path: path.join(base, dist),
        publicPath: '/'
    };

    const plugins = [
        ...extraPlugins
    ];
    const loaders = [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: babelOptions
                },
                ...(
                    eslint ? [{
                        loader: "eslint-loader",
                        options: getESLintOptions()
                    }] : []
                )
            ]
        },
        ...extraLoaders
    ]

    if (entrys && demo) {
        // application
        entrys.forEach(file => {
            const res = [];
            if (useBabelPolyfill) {
                res.push('babel-polyfill');
            }
            res.push(demo + '/' + file + '.js');
            entryConfig[file] = res;
        });
        outputConfig.filename = `[name].${suffix}.js`;
    } else if (entry && umdName) {
        // libaray
        entryConfig[umdName.toLowerCase()] = useBabelPolyfill ? ['babel-polyfill', entry] : [entry];
        outputConfig.library = umdName;
        outputConfig.libraryTarget = 'umd';
        outputConfig.filename = minify ? `[name].${suffix}.js` : `[name].js`;
    } else if (!entry && !entrys) {
        // is generating karma webpack config
    } else {
        throw 'get webpack config input not valid';
    }

    if (publicPath) {
        outputConfig.publicPath = publicPath;
    }

    if (commonsChunk) {
        plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'commons',
                filename: `commons.${suffix}.js`,
                minChunks: 2
            })
        )
    }

    if (react) {
        loaders.push({
            test: /\.less$/,
            exclude: /(node_modules)/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
        })
    }

    if (minify) {
        plugins.push(new UglifyJSPlugin());
    }

    if(liveReload){
        plugins.push(new LiveReloadPlugin());
    }

    var config = {
        entry: entryConfig,
        output: outputConfig,
        module: {
            loaders
        },
        plugins
    }

    return config;
};

const getBabelOptions = function ({ react }) {
    const res = {
        "presets": [
            "env",
            "stage-0"
        ],
        "plugins": [
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-decorators-legacy",
            "add-module-exports"
        ]
    };
    if (react) {
        res.plugins.push(
            "transform-react-jsx"
        )
    }

    return res;
}

const getESLintOptions = function () {

    const option = {};

    const hasOwnConfigFile = fs.existsSync(path.join(pwd, '.eslintrc'));
    if (!hasOwnConfigFile) {
        option.configFile = path.join(__dirname, '../space/eslint-config.json');
    }

    return option;
}

const getDemoEntries = function (dir) {

    if (fs.existsSync(dir)) {

        const filesInDemo = fs.readdirSync(dir);
        const demoEntryList = filesInDemo.map(file => {
            if (path.extname(file) === '.js') {
                const baseName = path.basename(file, '.js');
                const htmlFileName = path.basename(file, '.js') + '.html';
                if (filesInDemo.indexOf(htmlFileName) !== -1) {
                    return baseName;
                }
            }
            return null;
        }).filter(Boolean);

        return demoEntryList;

    } else {

        return null;
    }
}

const getDevTask = function ({ webpackConfig, demo, port, devCors, demoEntryList }) {

    const dev = function (cb) {

        // const templateStr = fs.readFileSync(path.join(__dirname, '../space/demo-list.handlebars'), 'utf-8');
        // const template = Handlebars.compile(templateStr);

        const config = webpackConfig;
        const app = express();
        const compiler = webpack(config);
        if (devCors) {
            app.use(cors());
        }

        app.get('/', function (req, res) {
            const templateStr = fs.readFileSync(path.join(__dirname, '../space/demo-list.handlebars'), 'utf-8');
            const template = Handlebars.compile(templateStr);

            const data = {
                demos: demoEntryList.map(item => {
                    return { name: item }
                })
            }
            res.send(template(data));
        });

        app.use(express.static(demo));
        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));

        app.listen(port, function () {
            log('[webpack-dev-server]', `started at port ${port}`);
        });

        open(`http://127.0.0.1:${port}/`);
    }
    return dev;
}

const libraryTasks = function (
    {
        port = 3000,
        base = process.cwd(),
        entry = './src/index.js',
        src = './src',
        lib = './lib',
        demo = './demo',
        dist = './dist',
        umdName = 'foo',
        devSuffix = 'bundle',
        buildSuffix = 'min',
        react = false,
        loaders = [],
        plugins = [],
        babelPolyfill = false,
        devCors = true,
        watchTest = false,
        testEntryPattern = 'src/**/*.spec.js',
        eslint = true,
        minify = true,
        liveReload = false
    } = {}
) {

    const demoEntryList = getDemoEntries(demo);
    const babelOptions = getBabelOptions({ react });

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
            liveReload
        }),
        demo,
        port,
        devCors,
        demoEntryList
    }) : function () {
        log.error(`Warning : There's no demo entries in directory ${demo}, the dev task does nothing.`);
    }

    const build = function () {
        fs.emptyDirSync(dist);
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
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
                eslint
            })))
            .pipe(gulp.dest(dist));
    }

    const compile = function () {
        fs.emptyDirSync(lib);
        const files = glob.sync(src + '/**/*.js');
        files.forEach(function (file) {
            const res = babel.transformFileSync(file, babelOptions);
            const target = file.replace(src, lib);
            fs.outputFileSync(target, res.code, 'utf-8');
        });
    }

    const test = function (done) {
        new KarmaServer({
            configFile: path.join(__dirname, '../space/karma.conf.js'),
            testEntryPattern,
            singleRun: watchTest ? false : true,
            webpack: getWebpackConfig({
                entry,
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

    const lint = function () {
        return gulp.src(path.join(base, src, '**/*.js'))
            .pipe(gulpESLint(getESLintOptions()))
            .pipe(gulpESLint.format())
            .pipe(gulpESLint.failAfterError());
    }

    return {
        dev, build, compile, test, lint: eslint ? lint : null
    }
}


const applicationTasks = function (
    {
        port = 3000,
        base = process.cwd(),
        demo = './demo',
        dist = './dist',
        devSuffix = 'bundle',
        buildSuffix = 'bundle',
        react = false,
        loaders = [],
        plugins = [],
        babelPolyfill = false,
        devCors = true,
        watchTest = false,
        testEntryPattern = 'src/**/*.spec.js',
        commonsChunk = true,
        publicPath = './',
        eslint = true,
        minify = true,
        liveReload = false
    } = {}
) {
    const demoEntryList = getDemoEntries(demo);
    const babelOptions = getBabelOptions({ react });

    const dev = getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions,
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

    const build = function () {
        fs.emptyDirSync(dist);
        const taskBuild = gulp.src(demoEntryList)
            .pipe(webpackStream(getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                dist,
                suffix: buildSuffix,
                babelOptions,
                minify,
                react,
                loaders,
                plugins,
                babelPolyfill,
                commonsChunk,
                publicPath,
                eslint
            })))
            .pipe(gulp.dest(dist));
        const taskHtml = gulp.src(demo + '/*.html')
            .pipe(replace('__TIMESTAMP__', 'timestamp=' + Date.now()))
            .pipe(replace(/<script src=\".+livereload.js\"><\/script>/g, ''))
            .pipe(gulp.dest(dist));

        return mergeStream(taskBuild, taskHtml);
    }

    const test = function (done) {
        new KarmaServer({
            configFile: path.join(__dirname, '../space/karma.conf.js'),
            testEntryPattern,
            singleRun: watchTest ? false : true,
            webpack: getWebpackConfig({
                entry: demoEntryList,
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
            webpackMiddleware: {}
        }, done).start();
    }

    const lint = function () {

        return gulp.src(path.join(base, demo, '**/*.js'))
            .pipe(gulpESLint(getESLintOptions()))
            .pipe(gulpESLint.format())
            .pipe(gulpESLint.failAfterError());
    }

    return { dev, build, test, lint: eslint ? lint : null };
}



module.exports = { libraryTasks, applicationTasks };