const path = require('path');

const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const getESLintOptions = require('./getESLintOptions');

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
    flow,
    eslint,
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

        if (publicPath) {
            outputConfig.publicPath = publicPath;
        }

    } else if (entry && umdName) {

        // libaray
        entryConfig[umdName.toLowerCase()] = useBabelPolyfill ? ['babel-polyfill', entry] : [entry];
        outputConfig.library = umdName;
        outputConfig.libraryTarget = 'umd';
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

    // built-in plugins

    if (flow) {
        plugins.push(
            new FlowWebpackPlugin()
        )
    }

    if (minify) {
        plugins.push(new UglifyJSPlugin());
    }

    if (liveReload) {
        plugins.push(new LiveReloadPlugin());
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

    // output config

    var config = {

        entry: entryConfig,

        output: outputConfig,

        module: {
            loaders
        },
        plugins,

        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
        }
    }

    return config;
};

module.exports = getWebpackConfig;