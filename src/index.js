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

const getWebpackConfig = function ({ entrys, entry, base, demo, dist, babelOptions, umdName }) {

    const entryConfig = {};
    const outputConfig = {
        path: path.join(base, dist),
        publicPath: '/'
    };
    const plugins = [];

    if (entrys && demo) {
        entrys.forEach(file => entryConfig[file] = ['babel-polyfill', demo + '/' + file + '.js']);
        outputConfig.filename = '[name].dev.js';
    } else if (entry && umdName) {
        entryConfig[umdName.toLowerCase()] = ['babel-polyfill', entry];
        outputConfig.library = umdName;
        outputConfig.libraryTarget = 'umd';
        outputConfig.filename = '[name].min.js';
        plugins.push(new UglifyJSPlugin());
    } else {
        throw 'get webpack config input not valid';
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

const libraryTasks = function (
    {
        port = 3000,
        base = process.cwd(),
        entry = './src/index.js',
        src = './src',
        lib = './lib',
        demo = './demo',
        dist = './dist',
        umdName = 'foo'
    } = {}
) {

    const filesInDemo = fs.readdirSync(demo);
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


    const dev = function (cb) {
        const config = getWebpackConfig({
            entrys: demoEntryList,
            base,
            demo,
            dist,
            babelOptions: getBabelOptions()
        });
        const app = express();
        const compiler = webpack(config);
        app.use(express.static(demo));        
        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));
        app.listen(3000, function () {
            gUtil.log('[webpack-dev-server]', `started at port ${port}`);
        });
    }

    const buildDemo = function () {
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                babelOptions: getBabelOptions()
            })))
            .pipe(gulp.dest(dist));
    }

    const build = function () {
        fs.emptyDirSync(dist);
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entry,
                base,
                umdName,
                dist,
                babelOptions: getBabelOptions()
            })))
            .pipe(gulp.dest(dist));
    }

    return {
        dev, build
    }
}


module.exports = { libraryTasks };