const gulp = require('gulp');
const gUtil = require('gulp-util');
const express = require('express');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const getWebpackConfig = function ({ entry, base, babelOptions }) {

    var config = {
        entry: {
            index: ['babel-polyfill', entry]
        },
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
        dist = './dist'
    } = {}
) {
    const dev = function (cb) {
        const config = getWebpackConfig({
            entry: demo + '/index.js',
            base,
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
                entry, base,
                babelOptions: getBabelOptions()
            })))
            .pipe(gulp.dest(dist));
    }
    return {
        dev, build
    }
}


module.exports = { libraryTasks };