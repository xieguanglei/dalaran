const path = require('path');

module.exports = function (config) {
    config.set({
      basePath: '',
      plugins: [
        require('karma-mocha'),
        require('karma-chrome-launcher'),
        require('karma-webpack')
      ],
      frameworks: ['mocha'],
      files: [path.resolve(process.cwd(), config.testEntryPattern)],
      exclude: [
      ],
      preprocessors: {
        [path.resolve(process.cwd(), config.testEntryPattern)]: ['webpack'],
      },
      webpack: config.webpack,
      webpackMiddleware: config.webpackMiddleware,
      reporters: ['progress'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false,
      concurrency: Infinity
    })
  }
  