const path = require('path');

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  // we have config.testEntryPattern
  //         config.webpackMiddleware
  //         config.webpack
  config.set({
    basePath: '',
    plugins: [
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-webpack')
    ],
    frameworks: ['mocha'],
    files: [path.resolve(process.cwd(), config.testEntryPattern)],
    exclude: [],
    preprocessors: {
      [path.resolve(process.cwd(), config.testEntryPattern)]: ['webpack'],
    },
    webpack: { ...config.webpack, entry: undefined },
    webpackMiddleware: config.webpackMiddleware,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    // customLaunchers: {
    //   'ChromeHeadless': {
    //     base: 'Chrome',
    //     flags: [
    //       '--headless',
    //       '--no-sandbox',
    //       // '--disable-gpu',
    //       '--hide-scrollbars',
    //       '--mute-audio',
    //       '--remote-debugging-port=9222'
    //     ],
    //     debug: true
    //   }
    // },
    singleRun: false,
    concurrency: Infinity
  })
}
