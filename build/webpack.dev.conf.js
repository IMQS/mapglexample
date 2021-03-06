const merge = require('webpack-merge');
const path = require('path')
const baseConfig = require('./webpack.base.conf.js');

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',

    devServer: {
        inline: true,
        clientLogLevel: 'warning',
        stats: {
            errorDetails: true,
            colors: true,
            modules: true,
            reasons: true,
        },
        port: 2501,
        proxy: {
            "/": {
                target: "http://localhost",
                secure: false,
                changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    if (req.path.indexOf('/roads') === 0)
                        return '/roads';
                    return null;
                }
            },
        },
        watchOptions: {
            ignored: /node_modules\/[^(@imqs)]/
        },
        historyApiFallback: true,
        publicPath: "/roads",
        contentBase: path.resolve(__dirname, '../static')
    },

    module: {
        rules: [
        ]
    },

    plugins: [
    ]
});
