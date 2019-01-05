const path = require('path');
const minimatch = require('minimatch');

const getWebpackConfig = require('./get_config_webpack');



function getKarmaConfig({

    base,
    dist,
    suffix,

    babelPolyfill,
    react,
    typescript,

    loaders,
    plugins,

    testEntryPattern,
    coverageFilePattern,
    watchTest,
    headlessMode
}) {

    let cvp = 0;

    const coverageLoaders = coverageFilePattern ? [
        {
            test: e => {
                if (cvp !== 0) {
                    if (process.stdout.clearLine) {
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                    }
                }
                cvp++;
                process.stdout.write(`Process coverage ${cvp}/?.`);
                if (minimatch(e, coverageFilePattern)) {
                    return true;
                } else {
                    return false;
                }
            },
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
            },
            enforce: 'post',
            exclude: /node_modules/,
        }
    ] : [];

    const webpackConfig = getWebpackConfig({
        base,
        dist,
        suffix,

        babelPolyfill,
        react,
        typescript,

        loaders: [...loaders, ...coverageLoaders],
        plugins,

        lint: false,
        lintrcDir: './',
        sourcemap: true
    });

    const karmaConfig = {
        basePath: '',
        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-coverage-istanbul-reporter')
        ],
        frameworks: ['mocha'],
        files: [
            path.resolve(process.cwd(), testEntryPattern)
        ],
        exclude: [],
        preprocessors: {
            [path.resolve(process.cwd(), testEntryPattern)]: ['webpack'],
        },
        reporters: ['progress'],
        webpack: {
            ...webpackConfig,
            entry: undefined
        },
        webpackMiddleware: {
            quiet: true
        },
        port: 9876,
        colors: true,
        autoWatch: watchTest,
        browsers: headlessMode ? ['ChromeHeadless'] : ['Chrome'],
        coverageIstanbulReporter: {
            dir: path.join(process.cwd(), 'coverage'),
            reports: ['text-summary', 'html', 'cobertura'],
            fixWebpackSourcePaths: true
        },
        singleRun: watchTest ? false : true,
        concurrency: Infinity
    }

    if (coverageFilePattern) {
        karmaConfig.reporters.push('coverage-istanbul');
    }

    return karmaConfig;
}

module.exports = getKarmaConfig;