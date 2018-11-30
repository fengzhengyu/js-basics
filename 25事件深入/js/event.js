
/*
  1.此事件库解决ie678下，attachEvent 与addEventListener的三不同：
    一： this指向不同：attachEvent->window  addEventListener->ele
    二： 为元素绑定同一个行为的方法， 方法名一样： addEventListener只执行一次，attachEvent绑定相同的方法名几次执行几次
    三： 系统天生自带事件池：addEventListener按绑定顺序执行，attachEvent，乱序执行，每次执行不固定；

    run()该方法是解决ie678 事件执行的方法

  2.此事件库还使用 发布订阅模式，向外暴露自定义接口； 约定 ： 已“self”开头的事件;

    fire()该方式，是订阅发布模式的 中间环节，哪个模块需要发布，就放到该模块；

*/ 

// 绑定事件
function on(ele,type,fn){

  if(/^self/.test(type)){ //属于暴露接口自定义事件
    if(!ele[type]){
      ele[type] = [];
    }
    var a = ele[type];
    for(var i=0;i<a.length;i++ ){
      if(a[i] === fn)return;
    }
    a.push(fn);

  }else{
    if( "addEventListener" in document){
      ele.addEventListener(type,fn,false);
    }else{
      // 自定义事件池
    
      if(!ele['aEvent'+type]){
        ele['aEvent'+type] = [];
        ele.attachEvent('on'+type,function(){ //只执行一次
          run.call(ele); //执行的时候通过call方法改变this指向
        })
      }
      var ary = ele['aEvent'+type];
      
      for(var i = 0; i < ary.length; i++){
      
        if(ary[i] === fn){ //解决事件重复
          return;
        }
      }
      ary.push(fn);
  
    }
  }
};
// 专门为ie,执行自定义事件池，依次执行
function run(){
  var e = window.event;
  e.target = e.srcElement;
  e.stopPropagation = function(){ e.cancelBubble = true };
  e.preventDefault = function() { e.returnValue = false };
  e.pageX = e.clientX - (document.documentElement.scrollLeft || document.body.scrollLeft);
  e.pageY = e.clientY - ( document.documentElement.scrollTop || document.body.scrollTop);
 
  var ary = this['aEvent'+e.type];
 
  for(var i =0;i< ary.length;i++){
    if(typeof ary[i] === 'function'){ //防止数组塌陷，如果是null ，删除；函数才执行
      ary[i].call(this,e);
    }else{
      ary.splice(i,1);
      i--;
    }
  }  
   
};

// 发布订阅的 中间中枢

function fire(selfType,e){

  var a = this[selfType];
  if(a){
    for(var i=0;i<a.length;i++){
      if(typeof a[i] === 'function'){
        a[i].call(this,e);
      }else{
        a.splice(i,1);
        i--;
      }
     
    }
  }
}

// 解绑事件
function off(ele,type,fn){
  if(/^self/.test(type)){ //属于暴露接口自定义事件
    var a = ele[type];
    if(a){
      for(var i=0;i<a.length;i++){
        if(a[i] === fn){
          a[i] = null;
          break;
        }
      }
    }
  }else{
    if("removeEventListener" in document){
      ele.removeEventListener(type,fn,false);
      return;
    }
    var ary = ele['aEvent'+type];
    if(ary){
      for(var i=0;i<ary.length;i++){
        if(ary[i] === fn){
          ary[i] = null;//防止数组塌陷，让null 占位
          break;
        }
      }
    }


  }
};

function processThis(obj,fn){
  return function(e){
    fn.call(obj,e);
  }
}
