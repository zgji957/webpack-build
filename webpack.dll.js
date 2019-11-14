//优化webpack速度，把第三方库都集中到一个js中，用过dll来优化速度

const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry:{
        vendors:['react','react-dom','lodash']
    },
    output:{
        filename:'[name].dll.js',
        path:path.resolve(__dirname,'dll'),
        library:'[name]' // 暴露到全局window
    },
    plugins:[
        // 生成映射关系json文件，给webpack.common.js用
        new webpack.DllPlugin({
            name:'[name]',
            path:path.resolve(__dirname,'dll/[name].manifest.json')
        })
    ]
}