const webpack = require('webpack');
const path = require('path');
const webpackBaseConfig = require('./webpack.base.config');
const webpackMerge = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(webpackBaseConfig, {
    mode: 'development',
    /*output: {
        publicPath: '/',
        filename: '[hash].js',
        chunkFilename: '[hash].chunk.js'
    },*/
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8082,
        host: '192.168.2.223'
    },
    devtool: 'cheap-module-eval-source-map', // devtool由webpack直接提高，将打包后的文件中的错误映射到最初对应的文件中，便于调试
    plugins: [
        new HTMLWebpackPlugin({ //创建 .html 并自动引入打包后的文件
            chunks: ['index','iview'],
            filename: 'index.html',
            template: 'src/views/index/index.html',
            inject: true, // 参照最初创建的 .html 来生成 .html
            favicon: path.resolve('favicon.ico')
        })
    ],
});