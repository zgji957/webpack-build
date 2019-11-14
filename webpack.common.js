const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
    entry: {
        main: './src/index.js'
    },
    externals:['lodash'], // 打包代码的时候忽略在代码中引入的某些库
    resolve:{
        extensions:['.js','.jsx'] // 比如在引入import文件的时候没写后缀，他会自动寻找这个数组里的后缀
    },
    module: {
        rules: [
            // babel loader  
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                // babel loader里的options可以写在.babelrc里面，这里可以不用写
                options: {
                    // 一般项目用（需要在js中引入 import "@babel/polyfill"）
                    presets: [["@babel/preset-env", {
                        useBuiltIns: 'usage' // 用到es2015特性时，会自动引入polyfill
                    }]]
                    // 写库的时候用
                    // "plugins": [
                    //     [
                    //       "@babel/plugin-transform-runtime",
                    //       {
                    //         "absoluteRuntime": false,
                    //         "corejs": 2,
                    //         "helpers": true,
                    //         "regenerator": true,
                    //         "useESModules": false
                    //       }
                    //     ]
                    //   ]
                }
            },
            // 图片loader
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        outputPath: 'images/',
                        limit: 204800   // 小于200k的图片会被转为base64
                    }
                },
            },
            // 字体文件loader
            {
                test: /\.(eot|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                },
            },
        ]
    },
    plugins: [
        //HtmlWebpackPlugin 自动生成html，并引入bundle.js
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $:'jquery' // 当一个模块中用了$，webpack会自动帮忙引入jquery这个模块（shimming）
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath:path.resolve(__dirname,'dll/vendors.dll.js') // 添加额外js到html
        }),
        new webpack.DllReferencePlugin({
            manifest:path.resolve(__dirname,'dll/vendors.manifest.json') // 找json文件中的映射关系（import的模块在dll.js有的话直接用dll.js中的）
        })
    ],
    // tree shaking
    optimization: {
        // 只提取js中import引入的函数或者变量，不全部加载整个js
        usedExports: true,
        // 代码分割（提取公共js），也可用作import懒加载js（需配置babel，import返回promise）
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 2, // 被import的文件引入超过2个，才会独立打包生成这个js
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
        }
    },
    output: {
        filename: '[name].[hash].js', //hash用于js内容改变后去除浏览器缓存
        chunkFilename:'[name].[hash].chunk.js',
        path: path.resolve(__dirname, 'bundle'),
        library:'library', // 可以在window变量中访问library
        libraryTarget:'umd', // 可以通过common amd es6模块的引入方式引用导出的js
    },
}