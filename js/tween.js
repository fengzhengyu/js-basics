// 自执行函数，一保护私有变量不受外界干扰，二利用不销毁的作用域，存储一些需要的值
// 外部调用: 一使用return current ，二使用window.name = current

~ function () {
  var jsEffect = {
    Linear: function (t, b, c, d) {
      return c * t / d + b;
    }
  }

  // 实现多方向的运动动画
  /* 
    *curEle 当前需要操作的元素，
    *target 当前动画的目标位置，存储每个方向的目标位置{left:'',top:''}
    *duration 当前动画总时间
  */
  function move (curEle, target, duration,callback) {
    // 进来先清除之前的定时器
    clearInterval(curEle.timer);


    // 根据target 获取每一个方向的总距离与起始值
    var begin ={},change ={};
    for(var key in target){
      // key就是放行
      if(target.hasOwnProperty(key)){ //只遍历私有属性
        begin[key] = utils.css(curEle,key) //初始化开始值
        change[key] = target[key] - begin[key];//目标-起始

      }
    }
    // 实现多方向运动方向
    var time = 0;

    curEle.timer = setInterval(function(){
      time += 10;
      // 到达目标值
      if(time >= duration){

        // CSS(curEle,target) 批量设置目标值
        clearInterval(curEle.timer);

        // 运动完回调,还让函数中this 变为要操作的元素
        callback && callback.call(curEle);
        return;
      }

      // 没到达目标：分别获取每一个方向的的当前位置，给当前元素设置样式
      for(var key in target){
        // key就是放行
        if(target.hasOwnProperty(key)){ //只遍历私有属性
          var curPos = jsEffect.Linear(time,begin[key],change[key],duration);
          // CSS(curEle,key,curPos)
          utils.css(curEle,key,curPos);
        }
      } 

    },10)
  }
  window.jsAnimate = move;
}();