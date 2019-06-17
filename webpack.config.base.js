const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// npm install --save-dev mini-css-extract-plugin
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 配置vue
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
    // 配置文件入口和输出 npm install --save-dev webpack webpack-cli
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/bundle.js',
        publicPath: './',
    },
    // 通过使用不同的 style-loader 和 css-loader, 可以将 css 文件转换成JS文件类型。npm install --save-dev style-loader css-loader
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
                // use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
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
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
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
        // new MiniCssExtractPlugin({
        //     // 设置css文件的输出目录和名称
        //     filename: 'static/css/[hash:8].[name].css'
        // }),
        new VueLoaderPlugin(),
        //  // 指定环境,定义环境变
        new webpack.DefinePlugin({
            'test1': 'ggyy',
            'test2': 'aaabb',
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}