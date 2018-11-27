(function () {

  // bind: 给当前一个元素的某一行为绑定方法

  function bind(curEle, evenType, evenFn) {

    if ('addEventListener' in document) {
      curEle.addEventListener(evenType, evenFn);
      return;
    }
    // 创建零时函数 改变this指向
    var tempFn = function () {
      evenFn.call(curEle);
    };
    // 给零时函数做标记，方便删除辨认
    tempFn.mark = evenFn;
    // 创建自定义容器，存放类型的行为方法
    if (!curEle['myBind' + evenType]) {
      curEle['myBind' + evenType] = [];
    }
    // 解决重复
    var ary = curEle['myBind' + evenType];
    for (var i = 0; i < ary.length; i++) {
      var cur = ary[i];
      if (cur.mark === evenFn) {
        return;
      }
    }
    ary.push(tempFn)
    curEle.attachEvent('on' + evenType, tempFn)

  }

  function unbind(curEle, evenType, evenFn) {
    if ('removeEventListener' in document) {
      curEle.removeEventListener(evenType, evenFn, false);
      return;
    }
    // 从自定义容器找对应的类型的方法
    var ary = curEle['myBind' + evenType];
    for (i = 0; i < ary.length; i++) {
      var cur = ary[i];
      if (cur.mark === evenFn) {
        ary.splice(i, 1); //先删除自定义的事件
        cur.detachEvent('on' + evenType, cur); //再把绑定事件移除
        break;
      }
    }
  }

  // 自定义事件池
  function on(curEle, evenType, evenFn) {
    // 先创建自定义事件池
    if (!curEle['myEvent' + evenType]) {
      curEle['myEvent' + evenType] = [];
    }
    var ary = curEle['myEvent' + evenType];
    for (var i = 0; i < ary.length; i++) {
      if(ary[i] === evenFn){
        return;
      }
    }
    ary.push(evenFn);
    bind(curEle, evenType,run)
  }
  // 因为只有一个run（） 只要把自己事件池中的evenfn移除了就行了
  function off(curEle, evenType, evenFn){
    var ary = curEle['myEvent' + evenType];
    for(var i=0;i<ary.length;i++){
      var cur = ary[i];
      if(cur === evenFn){
        // ary.splice(i,1);  //从当前项删除一个
         // 为了防止塌陷问题，我们在移除的时候不要原数组中的每个对应的 索引进行改变（数组的长度不能变）
        ary[i] = null; 
        break;
      }
    }
  }

  // run : 给当前元素的行为绑定唯一一个方法
  function run(e){
    e = e || window.event;
    var flag = e.target? true:false;

    if(!flag){
      // 处理ie兼容 重写方法
      e.target = e.srcElement;
      e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
      e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
      e.preventDefault = function(){
        e.returnValue = false;
      };
      e.stopPropagation = function(){
        e.cancelBubble = true;

      }
    }
    // 取自定义事件池  bind(curEle, evenType,run) run执行  this 是curEle
    var ary = this['myEvent'+e.type];
    for(var i=0;i<ary.length;i++){
      var tempFn = ary[i];
      if(typeof tempFn  === 'function'){
        tempFn.call(this,e); //依次执行，改变this，把处理好e传出去
      }else{
        // 当前这一项是null ,把它移除
        ary.splice(i,1);
        i--; //索引是0 --后-1 for里面++ i =0 还是从头走
      }

    }

  }
  window.FengEvent ={
    bind: bind,
    unbind: unbind,
    on: on,
    off: off
  }
})();