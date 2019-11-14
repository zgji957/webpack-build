const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css代码分割

const prodConfig = {
    mode: 'production', // development、production
    devtool: 'cheap-module-source-map', // 设置映射，如果代码有错误，能对应到源代码报错的行数，而不是压缩编译后的代码
    module: {
        rules: [
            // css loader 
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
    ],
}

module.exports = merge(commonConfig, prodConfig)
