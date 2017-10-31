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

const getWebpackConfig = function ({ entrys, entry, base, demo, dist, babelOptions, umdName, suffix, minify }) {

    const entryConfig = {};
    const outputConfig = {
        path: path.join(base, dist),
        publicPath: '/'
    };
    const plugins = [];

    if (entrys && demo) {
        entrys.forEach(file => entryConfig[file] = ['babel-polyfill', demo + '/' + file + '.js']);
        outputConfig.filename = `[name].${suffix}.js`;
    } else if (entry && umdName) {
        entryConfig[umdName.toLowerCase()] = ['babel-polyfill', entry];
        outputConfig.library = umdName;
        outputConfig.libraryTarget = 'umd';
        outputConfig.filename = `[name].${suffix}.js`;
    } else {
        throw 'get webpack config input not valid';
    }

    if(minify){
        plugins.push(new UglifyJSPlugin());        
    }

    var config = {
        entry: entryConfig,
        output: outputConfig,
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                }
            ]
        },
        plugins
    }

    return config;
};

const getBabelOptions = function () {
    const res = {
        "presets": [
            "env",
            "stage-0"
        ],
        "plugins": [
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-react-jsx",
            "transform-decorators-legacy",
            "add-module-exports"
        ]
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

const getDevTask = function ({ webpackConfig, demo, port }) {
    const dev = function (cb) {
        const config = webpackConfig;
        const app = express();
        const compiler = webpack(config);
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
        buildSuffix = 'min'
    } = {}
) {

    const demoEntryList = getDemoEntries(demo);

    const dev = getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions: getBabelOptions()
        }),
        demo,
        port
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
                babelOptions: getBabelOptions(),
                minify: true
            })))
            .pipe(gulp.dest(dist));
    }

    return {
        dev, build
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
        buildSuffix = 'bundle'
    } = {}
) {
    const demoEntryList = getDemoEntries(demo);

    const dev = getDevTask({
        webpackConfig: getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            suffix: devSuffix,
            babelOptions: getBabelOptions()
        }),
        demo,
        port
    });

    const build = function () {
        fs.emptyDirSync(dist);        
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                dist,
                suffix: buildSuffix,
                babelOptions: getBabelOptions(),
                minify: true
            })))
            .pipe(gulp.dest(dist));
    }

    return {dev, build};
}


module.exports = { libraryTasks, applicationTasks };