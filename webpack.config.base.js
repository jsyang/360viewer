const path           = require('path');
const webpack        = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProd = (process.env.NODE_ENV === 'production');

const devtool = isProd ?
    '' : 'inline-eval-cheap-source-map';

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    isProd ? new UglifyJsPlugin() : null
].filter(Boolean);

module.exports = {
    cache:   true,
    devtool,
    plugins,
    output:  {
        path: path.resolve(__dirname)
    },
    resolve: {
        // Turn on for further performance improvements
        // https://webpack.js.org/configuration/resolve/#resolve-unsafecache
        unsafeCache: false,
        modules:     ['node_modules', 'src'],
        extensions:  [
            '.ts',
            '.tsx',
            '.js'
        ]
    },
    module:  {
        rules: [
            {
                test:    /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                loaders: [
                    'ts-loader?silent=true'
                ]
            }
        ]
    }
};