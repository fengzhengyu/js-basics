// 引jquery方法一： 在index.html 中script src 引




// 引jquery方法二： 这么引用多少次 打包多少次
// import $ from 'jquery'


//引jquery方法三  webpack.ProvidePlugin  //变量变成每个模块都能使用的，但是不是放在window上需要配合cdn

// 引jquery方法四 expose-loader   需要在最开始引一次jquery

// import $ from 'jquery'
// import './a.js'
// console.log($)

import './index.css'

import test from './test.js'
console.log('index')


