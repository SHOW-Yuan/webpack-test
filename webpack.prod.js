const path = require('path');
const glob = require('glob');

const { webpack, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetplugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

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
    optimization: {
        splitChunks: {
            // async：异步引入的库进行分离（默认），  initial： 同步引入的库进行分离， all：所有引入的库进行分离（推荐）
            chunks: 'all', 
            minSize: 30000, // 抽离的公共包最小的大小，单位字节
            maxSize: 0, // 最大的大小
            minChunks: 1, // 资源使用的次数(在多个页面使用到)， 大于1， 最小使用次数
            maxAsyncRequests: 5,  // 并发请求的数量
            maxInitialRequests: 3, // 入口文件做代码分割最多能分成3个js文件
            automaticNameDelimiter: '_', // 文件生成时的连接符
            automaticNameMaxLength: 30, // 自动自动命名最大长度
            name: true, //让cacheGroups里设置的名字有效
            cacheGroups: { //当打包同步代码时,上面的参数生效
                vendors: {
                    name: 'vendors', // 所有的库都打包到一个叫vendors的js文件里
                    test: /[\\/]node_modules[\\/]/,  //检测引入的库是否在node_modlues目录下的
                    priority: -10, //值越大,优先级越高.模块先打包到优先级高的组里
                },
                default: {
                    minChunks: 2, // 上面有
                    priority: -20,  // 上面有
                    reuseExistingChunk: true //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                }
            }
        }
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
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js?_bid=4042',
        //             global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js?_bid=4042',
        //             global: 'ReactDOM',
        //         },
        //     ],
        // })
    ]
}