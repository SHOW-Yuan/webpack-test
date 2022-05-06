const path = require('path');
const { webpack, HotModuleReplacementPlugin } = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 指定编译模式
    mode: 'development',
    // 指定编译入口文件
    entry: './src/appAdmin.js',
    // 指定编译输出文件
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
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
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    // 插件用于文件的优化 资源管理和环境变量注入 
    // 作用于整个构建过程
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './src/index.html'
        // }),
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        static: './dist',
        hot: true
    }
}