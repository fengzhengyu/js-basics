

//  common.js 规范

const  path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniExtractPlugin = require('mini-css-extract-plugin'); //压缩css 插件
const TerserJSPlugin = require('terser-webpack-plugin'); //压缩js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css 插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
;

module.exports = {
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'

    },
    devServer: {
        port: 9999,
        open: false ,
        compress: true, //启动gzip压缩
        contentBase: 'aaa', //aaa目录下的资源文件可以访问
        // proxy: {
        //     "/api":{
        //         target: "http://localhost:6000", //设置服务器请求地址
        //         // secure: false, 代理服务器是https
        //         changeOrigin: true, //把请求头中的host地址改为服务器的地址
           
        //         pathRewrite:    {"/api": ''} // 后台没 api  重写路径  /api = ""
        //     }
        // },
        before(app){ //after 已9999端口创建一个服务，这样没有跨域 ,模拟后台服务
            app.get('/api/user',function(req,res){
                console.log(res.json({name:'ff'}))
            })
        }

    },
    // 压缩js、css
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'./index.html'),
            filename:'index.html'
        }),
        new MiniExtractPlugin({
            filename: 'css/main.css'
        }),
        new CleanWebpackPlugin()
    ],
    module:{ //确定对什么文件进行转换,怎么转换 需要哪些加载器
             // use 的value 可以是三种 "" {}  []
          
        rules:[
             // 加载器是 从下往上执行，先加载css 在插入style标签
            // {
            //     test: /\.css$/,
            //     use: ["style-loader","css-loader"] //写一行 是从右往左    index.js 引less
            // },
            // js 引入css
            // {   
            //     test: /\.css$/,
            //     use: ["style-loader",{//css 引less
            //             loader: "css-loader",
            //             options: {
            //                 importLoaders: 2 //用后面几个加载器来解析
            //             }
            //         },"postcss-loader","less-loader"
            //     ] 
            // },
            //  分离css  link 插入html
            {   
                test: /\.css$/,
                use: [
                    {
                        loader: MiniExtractPlugin.loader
                    
                    },
                    {//css 引less
                        loader: "css-loader",
                        options: {
                            importLoaders: 2 //用后面几个加载器来解析
                        }
                    },"postcss-loader","less-loader"
                ] 
            },
            {
                test: /\.less$/,
                use: ["style-loader","css-loader","less-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit: 10*1024,
                        outputPath:'img', //输出文件夹
                        publicPath:'www.baidu.com/img'//图片前缀 
                    }
                }
               
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)/,
                use: "file-loader"
            },
            {
                test: /\.js/,
                use: {
                    loader:"babel-loader",
                    // options: {
                    //     presets: ["@babel/preset-env"], //映射
                    //     plugins:[] 
                    // }
                }
            }
           

        ]

    }
}

// 每次打包后插入html  , 在浏览器打开 (安装html-webpack-plugin)
// webpack-dev-server   配置开发服务
//  加载css  需要 css-loader style-loader
//  less sass  stylus

    //  less less-loader 
    //  node-sass sass-loader
    //  stylus stylus-loader
//  css 兼容性处理 postcss-loader(样式处理工具，可以借助自定义插件，重新定义 css 例如：给css 加私有前缀（插件 autoprefixer）)
//  .browserslistrc 文件 配置兼容性浏览器覆盖率

// 打包css  link 方式插入 HTML 用插件  mini-css-extract-plugin
// npm i optimize-css-assets-webpack-plugin terser-webpack-plugin(压缩css 压缩js  压缩css  webpack自带的压缩js失效， 这是生产环境用的 )

// npm install --save-dev clean-webpack-plugin  (清除 dist 内容插件，用法 结构))


// babel 
//  babel-loader  是 webpack与babel的桥梁
// @babel/core  babel的核心模块
// @babel/preset-env  主要是 es6转换es5 插件的集合
// useBuiltIns 按需转换es6的 需要配合corejs一起使用
// npm install --save core-js@3

// 通过@babel/plugin-transform-runtime 自动调用@babel/runtime  (减少代码冗余量，提出公共部分)

// 借助插件 打包草案语法 @babel/plugin-proposal-class-properties  loose": true宽松写法
//  借助插 @fn // 装饰器的 草案写法  npm install --save-dev @babel/plugin-proposal-decorators