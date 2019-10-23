

// import sum from  './sum.js';
// import './index.css';

// import url from './timer.jpg';
// let img = new Image();
// img.src= url;

// document.body.appendChild(img);
// // import './a.less'
// console.log(sum(3,8))

// class Son{
//     constructor(){
//         this.a = 1
//     }
// }
// let s = new Son();
// console.log(s.a)

// let  p = new Promise((resolve,reject)=>{
//     console.log(1)
// })


// 草案语法（有些人这么写） 上面的写法 不支持 
// @fn // 装饰器的 草案写法
// class Son{
//   a =1
// }

// function fn(target) {  
//   // console.log(target)
//   target.b = 4; //这是Son 的静态属性

// }
// let s = new Son();

// 跨域配置
var xhr = new XMLHttpRequest();
xhr.open('get','/api/user',true);
xhr.onreadystatechange = function(){
  console.log(xhr.response)
}
xhr.send();


