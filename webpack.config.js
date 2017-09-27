const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {

    entry: './public/index.js',
    // tylko dla development, nie production (!)
    //devServer: {
    //    contentBase: path.join(__dirname, "dist"),
    //    compress: true,
    //    port: process.env.PORT || 8080,
    //    allowedHosts: [
    //        '192.168.1.4'
    //    ]
    //},

    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: "/public/"
    },

    module: {
        loaders: [
            { test: [/\.js$/, /\.jsx$/], loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(png|jpg|gif)$/, loader: "url-loader?limit=8192"},
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },

    plugins: [HtmlWebpackPluginConfig]
};


