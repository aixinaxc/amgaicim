const webpack = require('webpack');
const path = require('path');
const webpackBaseConfig = require('./webpack.base.config');
const webpackMerge = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin'); // 用于清除目录内容

module.exports = webpackMerge(webpackBaseConfig, {
    mode: 'production',
    /*output: {
        publicPath: '', // https://...这部分为你的服务器域名
        filename: '[name].[hash].js',
        chunkFilename: '[hash].chunk.js'
    },*/
    plugins: [
        // 打包之前使用这个插件尝试清除dist目录下的文件
        new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new HTMLWebpackPlugin({ //创建 .html 并自动引入打包后的文件
            chunks: ['index','iview'],
            filename: 'index.html',
            template: 'src/views/index/index.html',
            inject: true, // 参照最初创建的 .html 来生成 .html
            favicon: path.resolve('favicon.ico')
        })
    ]
});