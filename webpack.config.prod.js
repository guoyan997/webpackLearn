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
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 清除无用的css
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
    // 配置文件入口和输出 npm install --save-dev webpack webpack-cli
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/bundle.js',
        publicPath: './',
    },
    mode: "production", // 开发模式
    devtool:"cheap-module-eval-source-map",// 开发环境配置
    // 配置一个简单的Web服务器和实时热更新的能力  npm install --save-dev webpack-dev-server
    devServer: {
        contentBase: './dist',//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        host:'localhost',
        port:7000,
        hot:true,
        inline: true,//实时刷新
        hot:true,//Enable webpack's Hot Module Replacement feature
        compress:true,//Enable gzip compression for everything served
        overlay: true, //Shows a full-screen overlay in the browser
        stats: "errors-only" ,//To show only errors in your bundle
        open:true, //When open is enabled, the dev server will open the browser.
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                pathRewrite: {"^/api" : ""}
            }
        } //重定向, 处理跨域
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
    // 设置html模板 npm install --save-dev html-webpack-plugin
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
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        //  // 指定环境,定义环境变
        new webpack.DefinePlugin({
            'test1': 'ggyy',
            'test2': 'aaabb',
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 清除无用 css
        new PurifyCSS({
            paths: glob.sync([
                // 要做 CSS Tree Shaking 的路径文件
                path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
                path.resolve(__dirname, './src/*.js')
            ])
        })
    ]
}