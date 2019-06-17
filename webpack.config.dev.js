const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 压缩JS文件 npm install --save-dev uglifyjs-webpack-plugin
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
// 因为CSS的下载和JS可以并行，当一个HTML文件很大的时候，可以把CSS单独提取出来加载
// npm install --save-dev mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩CSS文件 npm install --save-dev optimize-css-assets-webpack-plugin
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 打包前先清空输出目录 npm install --save-dev clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 配置vue
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-[hash:5].bundle.js",
        chunkFilename: "[name]-[hash:5].chunk.js"
    },
    mode: "development", // 开发模式
    devtool:"cheap-module-eval-source-map",// 开发环境配置
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8000, // 本地服务器端口号
        hot: true, // 热重载
        overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
        proxy: {
            // 跨域代理转发
            "/comments": {
                target: "https://m.weibo.cn",
                changeOrigin: true,
                logLevel: "debug",
                headers: {
                    Cookie: ""
                }
            }
        },
        historyApiFallback: {
            // HTML5 history模式
            rewrites: [{ from: /.*/, to: "/index.html" }]
        }
    },
    // 压缩js文件
    optimization: {
        minimizer: [
            // 压缩js
            new UglifyWebpackPlugin({
                parallel: 4
            }),
            // 压缩css
            new OptimizeCssAssetsWebpackPlugin()
        ],
        splitChunks: {
            chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
        },
        // 清除到代码中无用的js代码，只支持import方式引入，不支持commonjs的方式引入
        usedExports:true
    },
    // 通过使用不同的 style-loader 和 css-loader, 可以将 css 文件转换成JS文件类型。npm install --save-dev style-loader css-loader
    module: {
        rules: [
            {
                test: /\.css/,
                // use: ['style-loader', 'css-loader'],
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // file-loader: 解决CSS等文件中的引入图片路径问题
            // url-loader: 当图片小于limit的时候会把图片Base64编码，大于limit参数的时候还是使用file-loader进行拷贝
            // npm install --save-dev url-loader file-loader
            {
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'static/images/[hash:8].[name].[ext]',
                            // 这里配置图片的输出路径，要匹配上static这个路径层级
                            publicPath: '../../'
                        }
                    }
                ]
            },
            // npm install --save-dev node-sass sass-loader
            {
                test: /\.scss/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            // 处理es6的js文件
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ]
    },
    plugins: [
        // html模板
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename:'index.html'
        }),
        // 分离过大的css,js和css分开下载，提高加载效率
        new MiniCssExtractPlugin({
            // 设置css文件的输出目录和名称
            filename: 'static/css/[hash:8].[name].css'
        }),
        // 输出前清空输出文件夹
        // new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        // webpack-dev-server 强化插件
        new DashboardPlugin(),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        //  // 指定环境,定义环境变
        // 编译时(compile time)插件
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            VERSION: JSON.stringify('5fa3b9'),
            BROWSER_SUPPORTS_HTML5: true,
            TWO: '1+1',
            'typeof window': JSON.stringify('object'),
            'process.env.NODE_ENV': JSON.stringify('development')
        })
        // 这里配置骨架屏
        // new SkeletonWebpackPlugin({
        //     webpackConfig: {
        //         entry: {
        //             app: resolve('./src/entry-skeleton.js')
        //         }
        //     },
        //     quiet: true
        // })
        // new webpack.DefinePlugin({
        //     'test1': 'ggyy',
        //     'test2': 'aaabb',
        //     'process.env.VUE_BASE_URL': JSON.stringify('production')
        // })
    ]
}