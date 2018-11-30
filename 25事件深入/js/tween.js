// 自执行函数，一保护私有变量不受外界干扰，二利用不销毁的作用域，存储一些需要的值
// 外部调用: 一使用return current ，二使用window.name = current

~ function () {
  var Tween = {
    // 匀速
    Linear: function (t, b, c, d) {
      return c * t / d + b;
    },
    // 指数衰减的反弹缓动
    Bounce: {
      easeIn: function(t, b, c, d) {
          return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
      },
      easeOut: function(t, b, c, d) {
          if ((t /= d) < (1 / 2.75)) {
              return c * (7.5625 * t * t) + b;
          } else if (t < (2 / 2.75)) {
              return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
          } else if (t < (2.5 / 2.75)) {
              return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
          } else {
              return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
          }
      },
      easeInOut: function(t, b, c, d) {
          if (t < d / 2) {
              return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
          } else {
              return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
          }
      }
    },
    // 二次方缓动
    Quad: {
      // 加速
      easeIn: function(t, b, c, d) {
          return c * (t /= d) * t + b;
      },
      // 减速
      easeOut: function(t, b, c, d) {
          return -c *(t /= d)*(t-2) + b;
      },
      // 先加速后减速
      easeInOut: function(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t + b;
          return -c / 2 * ((--t) * (t-2) - 1) + b;
      }
    },
     // 三次方缓动
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    // 四次方缓动
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    // 五次方缓动
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    // 正弦曲线运动
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    // 指数曲线的缓动
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    // 圆形曲线缓动
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    // 指数衰减的正弦曲线缓动
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    // 超过范围的三次方缓动
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    }
   
  }

  // 实现多方向的运动动画
  /* 
    *curEle 当前需要操作的元素，
    *target 当前动画的目标位置，存储每个方向的目标位置{left:'',top:''}
    *duration 当前动画总时间
    *effect 运动方式
    *callback 回调函数
  */
  function move (curEle, target, duration,effect) { //自定义事件代替callback ,想调多个都苦
    //  effect 支持以下情况：
    //  1）如果传递进来是数字： 0->Linear 1->Circ.easeInOut 2->Elastic.easeOut 3->Back.easeOut 4-> Bounce.easeOut 5-> Expo.easeIn
    //  2) 如果传递进来是数组：["Bounce","easeOut"] ->Tween.Bounce.easeOut
    //  3) 如果不传，默认用 Tween.Linear
    var tempEffect = Tween.Linear;
    if(typeof effect === 'number'){
       
        switch(effect){
            case 0:
                tempEffect = Tween.Linear;
                break;
            case 1:
                tempEffect = Tween.Circ.easeInOut;
                break; 
            case 2:
                tempEffect = Tween.Elastic.easeOut;
                break;
            case 3:
                tempEffect = Tween.Back.easeOut;
                break; 
            case 4:
                tempEffect = Tween.Bounce.easeOut;
                break; 
            case 5:
                tempEffect = Tween.Expo.easeIn;
        }
    }else if(effect instanceof Array){
     
        tempEffect = effect.length >= 2 ? Tween[effect[0]][effect[1]] :Tween[effect[0]];
    }else if(typeof effect === 'function'){
        // effect没传递值，应该是回调函数
    
        // callback = effect;
    
    }
    
    
    // 进来先清除之前的定时器
    clearInterval(curEle.timer);


    // 根据target 获取每一个方向的总距离与起始值
    var begin ={},change ={};
    for(var key in target){
      // key就是放行
      if(target.hasOwnProperty(key)){ //只遍历私有属性
        begin[key] = utils.css(curEle,key) //初始化开始值
        change[key] = parseInt(target[key]) - parseInt(begin[key]);//目标-起始
      
      }
    }
    // 实现多方向运动方向
    var time = 0;

    curEle.timer = setInterval(function(){
      time += 10;
      // 到达目标值
      if(time >= duration){
        // CSS(curEle,target) 批量设置目标值
        utils.css(curEle,target)
        clearInterval(curEle.timer);

        // 运动完回调,还让函数中this 变为要操作的元素
        // callback && callback.call(curEle);
        fire.call(curEle,'selfMoveEnd');
        return;
      }

      // 没到达目标：分别获取每一个方向的的当前位置，给当前元素设置样式
      for(var key in target){
        // key就是放行
        if(target.hasOwnProperty(key)){ //只遍历私有属性
          var curPos = tempEffect(time,begin[key],change[key],duration);
          // CSS(curEle,key,curPos)
          utils.css(curEle,key,curPos);
        }
      } 

    },10)
  }
  window.jsAnimate = move;
}();