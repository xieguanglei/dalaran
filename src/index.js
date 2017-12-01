const gulp = require('gulp');
const gUtil = require('gulp-util');
const express = require('express');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const babel = require('babel-core');
const glob = require('glob');
const cors = require('cors');
const KarmaServer = require('karma').Server;


const getWebpackConfig = function ({ entrys, entry, base, demo, dist, babelOptions, umdName, suffix, minify, react,
    loaders: extraLoaders, plugins: extraPlugins, babelPolyfill: useBabelPolyfill }) {

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
            use: {
                loader: 'babel-loader',
                options: babelOptions
            }
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
        outputConfig.filename = `[name].${suffix}.js`;
    } else if (!entry && !entrys) {
        // is generating karma webpack config
    } else {
        throw 'get webpack config input not valid';
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

    var config = {
        entry: entryConfig,
        output: outputConfig,
        module: {
            loaders,
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

const getDemoEntries = function (dir) {
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
}

const getDevTask = function ({ webpackConfig, demo, port, devCors }) {
    const dev = function (cb) {
        const config = webpackConfig;
        const app = express();
        const compiler = webpack(config);
        if (devCors) {
            app.use(cors());
        }
        app.use(express.static(demo));
        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));
        app.listen(port, function () {
            gUtil.log('[webpack-dev-server]', `started at port ${port}`);
        });
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
            loaders,
            plugins,
            babelPolyfill,
            devCors
        }),
        demo,
        port,
        react
    });

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
                minify: true,
                react,
                loaders,
                plugins,
                babelPolyfill
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
            singleRun: true,
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
                babelPolyfill
            }),
            webpackMiddleware: {},
            singleRun: false
        }, done).start();
    }

    return {
        dev, build, compile, test
    }
}


const applicationTasks = function (
    {
        port = 3000,
        base = process.cwd(),
        entry = './src/index.js',
        src = './src',
        lib = './lib',
        demo = './demo',
        dist = './dist',
        devSuffix = 'bundle',
        buildSuffix = 'bundle',
        react = false,
        loaders = [],
        plugins = [],
        babelPolyfill = false,
        devCors = true
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
            babelPolyfill
        }),
        demo,
        port,
        devCors
    });

    const build = function () {
        fs.emptyDirSync(dist);
        const taskBuild = gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                dist,
                suffix: buildSuffix,
                babelOptions,
                minify: true,
                react,
                loaders,
                plugins,
                babelPolyfill
            })))
            .pipe(gulp.dest(dist));
        const taskHtml = gulp.src(demo + '/*.html')
            .pipe(gulp.dest(dist));
        return [taskBuild, taskHtml];
    }

    return { dev, build };
}


module.exports = { libraryTasks, applicationTasks };