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

const getWebpackConfig = function ({ entrys, base, demo, babelOptions }) {

    const entry = {};
    entrys.forEach(file => entry[file] = ['babel-polyfill', demo + '/' + file + '.js']);

    var config = {
        entry,
        output: {
            path: path.join(base, 'build'),
            filename: '[name].bundle.js',
            publicPath: '/'
        },
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
        plugins: [
        ]
    }

    // if (!isDev) {
    //     config.plugins.push(new UglifyJSPlugin());
    // }

    return config;
};




const getBabelOptions = function () {
    return {
        "presets": [
            "env",
            "stage-0"
        ],
        "plugins": [
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-react-jsx",
            "transform-decorators-legacy"
        ]
    }
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
            babelOptions: getBabelOptions()
        });
        const app = express();
        const compiler = webpack(config);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));
        app.use(express.static(demo));
        app.listen(3000, function () {
            gUtil.log('[webpack-dev-server]', `started at port ${port}`);
        });
    }

    const build = function () {
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entrys: demoEntryList,
                demo,
                base,
                babelOptions: getBabelOptions()
            })))
            .pipe(gulp.dest(dist));
    }

    const umd = function () {
        return gulp.src(entry)
            .pipe(webpackStream(getWebpackConfig({
                entry,
                base,
                babelOptions: getBabelOptions()
            })))
            .pipe(gulp.dest(dist));
    }

    return {
        dev, build
    }
}


module.exports = { libraryTasks };