const path = require('path');
const glob = require('glob');
const { webpack, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    mode: 'development',
    // 指定编译入口文件
    entry: entry,
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
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ].concat(htmlWebpackPlugins),
    devServer: {
        static: './dist',
        hot: true
    },
    devtool: 'eval-source-map'
}