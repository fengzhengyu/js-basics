/* 
  FZ 命名空间  namespace


*/

var FZ = {}; 
/**
 *interface Class  鸭式辩型法 核心：那接口的方法都实现（检测方法）
 * 
 * 接口需求需要两个参数
 * 参数一： 接口的名字 （string）
 * 参数二： 接受方法名称的集合 （array）
 */

FZ.Interface = function (name, methods) {
  // 判断接口参数
  if (arguments.length != 2) {
    throw new Error('this instance interface constructor arguments must be 2 length!')
  }

  this.name = name;
  // 
  this.methods = []; //定义内置空数组 等待接受methods的名字

  for (var i = 0, len = methods.length; i < len; i++) {

    //每个方法名字必须是字符串
    if (typeof methods[i] !== 'string') {
      new Error('The  interface method name is error!');
    }
    this.methods.push(methods[i]);

  }
}
/* 
  interface static method

*/

// 如果检验通过 不做任何操作 继续执行，不通过 抛出error
// 这个方法的目的就是检测方法的 
FZ.Interface.ensureImplements = function (object) {
  // 不是实例对象的时候
  if(typeof object === 'undefined'){
    throw new Error('the arguments must be object types!');
  }
  // 如果检测方法的参数小于2  
  if (arguments.length < 2) {
    throw new Error('FZ.Interface.ensureImplements methods constructor arguments must be >=2!');
  }

  // 获得接口实例对象
  for (var i = 1, len = arguments.length; i < len; i++) {
    var instanceInterface = arguments[i];
    // 判断参数是否是接口类的类型
    if (instanceInterface.constructor !== FZ.Interface) {
      throw new Error('the arguments constructor not be Interface class !');
    }
    // 循环接口对象里的每一个方法
    for (var j = 0; j < instanceInterface.methods.length; j++) {
      var methodName = instanceInterface.methods[j];
      // 如果方法名不存在 或者存在 不是函数
      if (!object[methodName] || typeof object[methodName] !== 'function') {
        throw new Error('the method "' + methodName + '" is not found');
      }
    }
  }
}

 /**
      * extend method 
      *继承公共方法

    **/ 

   FZ.extend = function (sub,parent) {  
    /*
      目的： 实现只继承父类的原型对象
    */ 
    var F= new Function(); // 步骤1创建一个空函数  目的： 空函数进行中转

    F.prototype = parent.prototype; //步骤2 实现空函数的原型与超类的原型对象转换

    sub.prototype = new F(); // 步骤3 实现原型继承

    sub.prototype.constructor = sub; // 步骤4  还原子类的构造器


    

    // 保存父类的原型的对象 一方面方便解耦，另一方面获取父类的原型

    sub.superName = parent.prototype; //自定义子类的静态属性，接受父类的原型对象

    // 判断父类原型对象的构造器  加保险,比如忘了还原父类构造器

    if(parent.prototype.constructor === Object.prototype.constructor){
      parent.prototype.constructor = parent;
    }


    

  }

  /**
   * 
   * 单体模式
   * 
   */
  
 
  FZ.EventUtil = {
    addHandler: function(element,type,handler){

      if(element.addEventListener){
        element.addEventListener(type,handler,false);

      }else  if(element.attachEvent){
        element.attachEvent('on'+type,handler);

      }

    },
    removeHandler:function(element,type,handler){
      if(element.removeEventListener){
        element.removeEventListener(type,handler,false);

      }else  if(element.detachEvent){
        element.detachEvent('on'+type,handler);

      }
    }
  }


/* each循环  可遍历多维数组*/
  Array.prototype.myEach = function(fn){

    try {
      // 1 遍历数组的的每一项
      this.i || (this.i=0); //计数器 记录当前遍历de元素位置

      // 2 严谨判断 长度大于0且参数必须是函数
      if(this.length>0 && fn.constructor == Function){

        // 循环遍历每一项
        while(this.i < this.length){ //范围控制

        // 获取每一项 
          var  e = this[this.i];
         
          // 并且每一项是数组
          if(e && e.constructor == Array){
            // 递归操作
            e.myEach(fn);
          }else{
            // b不是数组，就是单个元素
            // 执行回调函数，并且把参数传递给回调函数
            // fn.apply(null,[e]);
            // console.log(e)
            fn.call(e,e);
           
          }
        
          this.i++;
        
        }
        this.i = null; //自定义属性，用完销毁

      }

      
    } catch (error) {
        // do something
    }

    return this;
   

 }