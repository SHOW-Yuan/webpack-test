const path = require('path');
const glob = require('glob');

const { webpack, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetplugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.resolve(__dirname, './src/modules/*/index.js'));
    Object.keys(entryFiles).map( i => {
        const entryFile = entryFiles[i];

        // 获取html文件名
        const match = entryFile.match(/src\/modules\/(.*)\/index\.js/);
        const pageName = match && match[1];

        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `./src/modules/${pageName}/index.html`),
                filename: `${pageName}.html`,
                inject: true,
                minify: {
                  html5: true,
                  collapseWhitespace: true,
                  preserveLineBreaks: false,
                  minifyCSS: true,
                  minifyJS: true,
                  removeComments: false
                }
            })
        )
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    // 指定编译模式
    mode: 'production',
    // 指定编译入口文件
    entry,
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
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            // 1rem等于多少px（此时相对应750的设计稿 每1rem=75px
                            remUnit: 75,
                            // 小数点后保留多少位
                            remPrecision: 8
                        }
                    }
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
        ...htmlWebpackPlugins,
        // 创建css hash文件名
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css'
        }),
        new OptimizeCSSAssetplugin(),
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ]
}