const webpack             = require('webpack');
const webpackConfigAssign = require('webpack-config-assign');
const baseConfig          = require('./webpack.config.base');

module.exports = webpackConfigAssign({
    name:    'client',
    target:  'web',
    entry:   {
        main: './src/index.ts',
    },
    output:  {
        publicPath: '/',
        filename:   '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name:      'vendor',
            // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        })
    ]
}, baseConfig);