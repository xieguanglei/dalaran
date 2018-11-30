const path = require('path');

const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const getESLintOptions = require('./getESLintOptions');
const getTSLintOptions = require('./getTSLintOptions');

const getWebpackConfig = function ({

    // input
    base,
    entrys, demo,       // if (!!entrys && !!demo) is true, it's in application mode
    entry, umdName,     // otherwise if (!!entry && !!umdName) is true, it's in library mode

    // output
    dist, suffix,
    publicPath, // used only in appliaction mode

    // use babel by default
    babelOptions,
    babelPolyfill: useBabelPolyfill,

    // configs
    react,
    typescript,
    lint,
    lintrcDir,
    commonsChunk,
    liveReload,
    minify,

    // custom loaders and plugins
    loaders: extraLoaders,
    plugins: extraPlugins,

}) {

    const entryConfig = {};
    const outputConfig = {
        path: path.join(base, dist),
        publicPath: '/'
    };

    const optimization = {};

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
                }
            ]
        },
        {
            test: /\.ts$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: babelOptions
                },
                {
                    loader: 'ts-loader',
                    options: {
                        context: base,
                        configFile: path.join(__dirname, '../space/tsconfig.json')
                    }
                }
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
            res.push(demo + '/' + file + (typescript ? '.js' : '.js'));
            entryConfig[file] = res;
        });

        outputConfig.filename = `[name].${suffix}.js`;

        if (publicPath) {
            outputConfig.publicPath = publicPath;
        }

    } else if (entry && umdName) {

        // libaray

        entryConfig[umdName.toLowerCase()] = useBabelPolyfill ? ['babel-polyfill', entry] : [entry];

        outputConfig.library = umdName;
        outputConfig.libraryTarget = 'umd';
        outputConfig.libraryExport = 'default';
        outputConfig.filename = minify ? `[name].${suffix}.js` : `[name].js`;

    } else if (!entry && !entrys) {

        // generating karma webpack config

        // entry is not needed actually, but webpack will validate
        // so just mock a random one to cheat webpack
        entryConfig.index = './src/index';

    } else {

        throw 'get webpack config input not valid';

    }

    // built-in loaders

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

    if (lint) {

        loaders.push({
            test: /\.js$/,
            exclude: /(node_modules)/,
            enforce: 'pre',
            use: [
                {
                    loader: 'eslint-loader',
                    options: getESLintOptions({ lintrcDir })
                }
            ]
        });

        if (typescript) {

            loaders.push({
                test: /\.ts$/,
                exclude: /(node_modules)/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: getTSLintOptions({ lintrcDir })
                    }
                ]
            })
        }
    }

    // built-in plugins

    if (minify) {
        plugins.push(new UglifyJSPlugin());
    }

    if (liveReload) {
        plugins.push(new LiveReloadPlugin());
    }

    if (commonsChunk) {
        // TODO: commons chunk
    }

    // output config

    var config = {

        entry: entryConfig,

        output: outputConfig,

        module: {
            rules: loaders
        },

        plugins,

        resolve: {
            extensions: [".ts", ".js"],
        },

        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
        },

        mode: 'none',

        optimization
    }

    return config;
};

module.exports = getWebpackConfig;