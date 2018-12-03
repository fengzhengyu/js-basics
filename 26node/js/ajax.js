

(function(){
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
    if(!flag){
      throw new Error('your browser is not support ajax!')
    }
    return xhr;
  }

// 封装ajax ,当传递的参数不固定，使用对象传值法

  function ajax(options){
    // 设定默认值与定规则
    var _default = {
      url: '',       //请求地址
      type: 'get',   //  请求方式
      dataType: 'json', //设置响应数据格式
      async: true,   // 请求是同步还是异步
      data: null,    //请求主体中的内容
      getHead: null, //readyState===2执行回调
      success: null  //readyState===4执行回调

    };

    // 使用自己的值，覆盖默认值
    for(var key in options){
      if(options.hasOwnProperty(key)){
        _default[key] = options[key]
      }
    }
    // 请过挡墙请求是get 需要在url加随机数
    if(_default.type == 'get'){
      _default.url.indexOf("?") >= 0?  _default.url += "&":_default.url += "?";
      _default.url +="_="+Math.random();
    }

    var xhr = createXHR();
   
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange = function(){
      if(/^2\d{2}$/.test(xhr.status)){
        // readyState 等于2的时候做操作，必须保证是异步操作
        if(xhr.readyState === 2){
          if(typeof getHead === 'function'){
            _default.getHead.call(xhr);
          }
        }
        if(xhr.readyState === 4){
          var val = xhr.responseText;
          // 如果传递数据类型是json，获取应该是json格式对象
          if(_default.dataType === 'json'){
            val= "JSON" in window ? JSON.parse(val): eval("("+ val +")");
          }
          _default.success &&  _default.success.call(xhr,val);
        }
      }
    }
    xhr.send(_default.data);
  }
 
  window.ajax = ajax;

})();






