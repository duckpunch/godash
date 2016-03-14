var webpackCfg = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'PhantomJS' ],
    files: [
      'test/*.js'
    ],
    port: 8080,
    captureTimeout: 60000,
    frameworks: ['mocha'],
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: [ 'mocha', 'coverage' ],
    preprocessors: {
      'test/*.js': [ 'webpack' ]
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' }
      ]
    }
  });
};

