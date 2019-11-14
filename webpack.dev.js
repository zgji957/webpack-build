const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const devConfig = {
    mode: 'development', // development、production
    devtool: 'cheap-module-eval-source-map', // 设置映射，如果代码有错误，能对应到源代码报错的行数，而不是压缩编译后的代码
    // web-dev-server
    devServer: {
        contentBase: './bundle',
        open: true,
        hot: true, // 热更新
        hotOnly: true,
        historyApiFallback:true,// 区分路由和异步请求的地址
        proxy: {
            '/api': 'http://www.xxx.com'
        }
    },
    module: {
        rules: [
            // css loader 
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true // css模块化
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            },
        ]
    },
    //HtmlWebpackPlugin 自动生成html，并引入bundle.js
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

module.exports = merge(commonConfig,devConfig)