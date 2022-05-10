const path = require('path');
const { webpack, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetplugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    // 指定编译模式
    mode: 'production',
    // 指定编译入口文件
    entry: './src/appAdmin.js',
    // 指定编译输出文件
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'chanks/[name].[hash:8].js'
    },
    // webpack开箱即用的只有JS和JSON两种文件类型 其他类型文件需要使用Loaders转换成有效的模块
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin不能和style-loader一起使用
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            }
        ]
    },
    // 插件用于文件的优化 资源管理和环境变量注入 
    // 作用于整个构建过程
    plugins: [
        // 压缩html文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            inject: true,
            minify: {
              html5: true,
              collapseWhitespace: true,
              preserveLineBreaks: false,
              minifyCSS: true,
              minifyJS: true,
              removeComments: false
            }
        }),
        // 创建css hash文件名
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css'
        }),
        new OptimizeCSSAssetplugin(),
        new HotModuleReplacementPlugin(),
    ]
}