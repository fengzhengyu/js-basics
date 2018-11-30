// ajax 兼容所有浏览器 惰性思想

function createXHR(){
  var xhr = null,flag = false;
  var ary = [
    function(){
      return new XMLHttpRequest;
    },
    function(){
      return new ActiveXObject('Microsoft.XMLHTTP');
    },
    function(){
      return new ActiveXObject('Msxml2.XMLHTTP');
    },
    function(){
      return new ActiveXObject('Msxml3.XMLHTTP');
    }
  ];
  for(var i=0;i<ary.length;i++){
    var curFn = ary[i];
    try {
      xhr = curFn();
      // 本次循环执行没有错误:说明此方法是我想要的，下一次直接执行小方法，重写小方法，（完成就跳出循环）

      createXHR = curFn;
      flag = true;
      break;
    } catch (error) {
        // 本次循环执行出现错误，继续下一次循环
    }
    
  }
  if(!false){
    throw new Error('your browser is not support ajax!')
  }
  return xhr;
}
 