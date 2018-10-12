// 修改 webppack 配置文件后需重启才能生效
const path = require('path'); // node.js 中的基本包，用于处理路径
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: {
        index: './src/views/index/index.js'
    },
    output: {
        filename: 'assets/js/[name].js',
        path: path.join(__dirname, '../dist'), // 输出文件所在目录
        // publicPath: ''
    },
    externals: {//不打包的
        /*'mavon-editor': 'mavon-editor',
        'iview':'iview'*/
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', // 为 css 创建 style 标签并置入其中插入页面
                    'css-loader', // 处理 css
                    'postcss-loader', // 浏览器兼容问题
                ]
            },
            {
                test: /\.less/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader' // loader 由下往上依次开始处理
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { // 配置参数
                            limit: 1024, // 比较标准，小于标准的图片转换为 base64 代码
                            name: 'assets/img/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            // 管理字体文件
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/fonts/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
       /* runtimeChunk: {
            name: "manifest"
        },*/
        splitChunks: {
            cacheGroups: {
                iview: {
                    test: path.join(__dirname, '../node_modules/iview'),
                    name: "iview",
                    priority: -20,
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        // Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的
        new VueLoaderPlugin(),
    ]
}