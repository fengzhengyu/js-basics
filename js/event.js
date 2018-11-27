
/* 
  bind: 处理DOM3级事件绑定的兼容性问题（绑定方法）
  params；
    curEle 要绑定的元素
    evenType 要绑定的事件类型（click、mouseover）
    evenFn 要绑定的方法

*/
//  改变this指向兼容 
// function bind(curEle,evenTYpe,evenFn){
//   if("addEventListener" in window){


//      curEle.addEventListener(evenTYpe,evenFn,false)
//   }else{
//     // event 包一层，把evenFn在这里执行
//     var tempFn = function(){
//       evenFn.call(curEle)
//     }
//     // 给包装后的函数 也是对象，做一个标记，以便于区分
//     tempFn.mark = evenFn;
//     // 判断自定义属性是否存在，要储存多个方法包装后的结果
//     if(!curEle['myBind']){
//       curEle['myBind'] = []
//     }
//     curEle['myBind'].push(tempFn); //包装后的数组结果刚在当前自定义属性上


//     curEle.attachEvent('on'+evenTYpe,tempFn);
//   }
// }

// // 移除

// function unbind(curEle,evenTYpe,evenFn){
//   if("removeEventListener" in window){

//      curEle.removeEventListener(evenTYpe,evenFn,false)
//   }else{

//     var ary= curEle['myBind'];
//     for(var i=0;i<ary.length;i++){
//       if(ary[i].mark === evenFn){
//         curEle.detachEvent('on'+evenTYpe,ary[i]);
//         break;//找到后跳出循环
//       }
//     }
  
//   }
// }


// 重复问题

// function bind(curEle,evenType,evenFn){
//   if("addEventListener" in window){

  
//      curEle.addEventListener(evenType,evenFn,false)
//   }else{
//     // event 包一层，把evenFn在这里执行
//     var tempFn = function(){
//       evenFn.call(curEle)
//     };
//     // 给包装后的函数 也是对象，做一个标记，以便于区分
//     tempFn.mark = evenFn;
 
//     // 判断自定义属性是否存在，要储存多个方法包装后的结果
//     if(!curEle['myBind'+evenType]){ //+evenType 按类型分组
//       curEle['myBind'+evenType] = [];
//     }

//     // 解决重复问题
//     // 每一次再把自己对应的自定义属性的容器添加前，看一下之前是否已经有了，有了就return，不往事件池存储
//     var ary = curEle['myBind'+evenType];
//     for(var i=0;i<ary.length;i++){
//       var cur = ary[i];
//       if(cur.mark === evenFn){
//         return;
//       }
//     }
//     ary.push(tempFn); //包装后的数组结果刚在当前自定义属性上


//     curEle.attachEvent('on'+evenType,tempFn);
//   }
// }

// // 移除

// function unbind(curEle,evenType,evenFn){
//   if("removeEventListener" in window){

//      curEle.removeEventListener(evenType,evenFn,false)
//   }else{
    
  
//     var ary= curEle['myBind'+evenType];
   
//     for(var i=0;i<ary.length;i++){
//       var cur = ary[i];
//       if (cur.mark === evenFn){
//         ary.splice(i,1); //找到后，把自己自定义容器的对应的事件移除
//         curEle.detachEvent('on'+evenType,cur);  //再把绑定的事件移除
//         break;//找到后跳出循环
//       }
//     }
  
//   }
// }

function bind(curEle,evenType,evenFn){
  if("addEventListener" in window){

  
     curEle.addEventListener(evenType,evenFn,false)
  }else{
    // event 包一层，把evenFn在这里执行
    var tempFn = function(){
      evenFn.call(curEle)
    };
    // 给包装后的函数 也是对象，做一个标记，以便于区分
    tempFn.mark = evenFn;
 
    // 判断自定义属性是否存在，要储存多个方法包装后的结果
    if(!curEle['myBind'+evenType]){ //+evenType 按类型分组
      curEle['myBind'+evenType] = [];
    }

    // 解决重复问题
    // 每一次再把自己对应的自定义属性的容器添加前，看一下之前是否已经有了，有了就return，不往事件池存储
    var ary = curEle['myBind'+evenType];
    for(var i=0;i<ary.length;i++){
      var cur = ary[i];
      if(cur.mark === evenFn){
        return;
      }
    }
    ary.push(tempFn); //包装后的数组结果刚在当前自定义属性上


    curEle.attachEvent('on'+evenType,tempFn);
  }
}

// 移除

function unbind(curEle,evenType,evenFn){
  if("removeEventListener" in window){

     curEle.removeEventListener(evenType,evenFn,false)
  }else{
    
  
    var ary= curEle['myBind'+evenType];
   
    for(var i=0;i<ary.length;i++){
      var cur = ary[i];
      if (cur.mark === evenFn){
        ary.splice(i,1); //找到后，把自己自定义容器的对应的事件移除
        curEle.detachEvent('on'+evenType,cur);  //再把绑定的事件移除
        break;//找到后跳出循环
      }
    }
  
  }
}



// 顺序问题： 不能用浏览器自带事件池
// 自己模拟标准浏览器事件池
//  -> on :创建事件池，并且把需要给当前元素绑定的 方法一次的增加到事件池
function on(curEle,evenType,evenFn) { 
  // 首先创建自定义属性
  if(!curEle['myEvent'+ evenType]){ //每个行为类型都有自己的事件池
    curEle['myEvent' + evenType] = []
  }

  var ary = curEle['myEvent' + evenType] ;
  for(var i=0;i<ary.length;i++){
    if(ary[i] === evenFn){ //说明事件池有该事件
      return;
    }
  }
  ary.push(evenFn);
  // curEle.addEventListener(evenType,run,false) //不支持ie678 
  bind(curEle,evenType,run)
}

// -> off : 在自己的事件池中把某一个方法移除
function off(curEle,evenType,evenFn) { 
  //  因为只有一个run（） 只要把自己事件池中的evenfn移除了就行了
  var ary = curEle['myEvent' + evenType] ;
  for(var i=0;i<ary.length;i++){
    var cur = ary[i];
    if(cur === evenFn){
      // ary.splice(i,1);  //从当前项删除一个
      // 为了防止塌陷问题，我们在移除的时候不要原数组中的每个对应的 索引进行改变（数组的长度不能变）
      ary[i] = null; //让

      break;
    }
  }

}
// run : 我们只给当前元素绑定唯一一个方法run（），在点击的时候，根据自己事件池的方法顺序一个个执行
function run(e){
  // curEle.addEventListener(evenType,run,false) this->curle
  e = e || window.event;
 var flag  = e.target ? true: false; //ie 6-8不兼容e.target ，得到为false
 if(!flag){
  //  重写兼容写法
   e.target = e.srcElement;
   e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
   e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
   e.preventDefault = function(){
     e.returnValue = false;
   };
   e.stopPropagation = function(){
    e.cancelBubble = true;
   }; 
   
 }
  // 获取自己事件池绑定的方法，并且让这些方法依次执行 this就是e.target
  var ary = this['myEvent' + e.type] ;

  for(var i=0;i<ary.length;i++){
    var tempFn = ary[i];
    if(typeof tempFn  === 'function'){
      tempFn.call(this,e); //让方法执行，并改变this为当前元素
    }else{
      // 当前这一项是null ,把它移除
      ary.splice(i,1);
      i--; //索引是0 --后-1 for里面++ i =0 还是从头走
    }
    
  }

}