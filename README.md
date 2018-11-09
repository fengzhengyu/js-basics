# js-basics
js 基础知识总结


# i++和++i 的区别：
// i++: 先拿i的值进行计算，运算完成 本身加一
// ++i：先自身加一，再去运算
// 例如：
  var a =5;
  console.log(2+(a++)+(++a)+(++a)+(i++)) //30
  // 2+5= 7 a = 6
  // 7+7 = 14 a = 7
  // 14+8 = 22 a = 8
  // 22+8 = 30 a = 9

 #预解释 
 function fn(){
      var i =10;
      return function(n){
        console.log(n + (++i))
      }
    }
    var f = fn();
    f(10) //10+ 11
    f(20) // 20 +12
    fn()(10) //21
    fn()(20) // 31

  首先 在window下预解释：
    1.变量提前  var i, fn= xxxfff000 开辟空间, 存放函数字符串
    2.代码开始执行：
      f = fn执行完成返回结果赋给f ,fn()执行也就是 xxxfff000()执行形成私有作用域（暂定为A）；
      私有作用域A开始预解释：
        1.有形参先给形参赋值，上面没 var i；
        2.代码开始执行：
          i=10 ；
          return 一个函数，相当于新开一个内存空间（xxxfff111）存放函数体内容；
    =======================================================================================      
      f(10) 调用执行 -相当于 xxxfff111(10)  ->函数执行又形成私有作用域；
        1.形参赋值 n =10 
        2.代码执行：
          10+（++i）->当前作用域没变量 i ,找上级作用域A， ++i 使A中的i 变为11
          10+11 =21；
          代码执行完毕，当代作用域没被引用，随之销毁
      f(20) 调用执行 ->相当于 xxxfff111(20)  ->函数执行又形成私有作用域；
        1.形参赋值 n =20 
        2.代码执行：
          20+（++i）->当前作用域没变量 i ,找上级作用域A， ++i 使A中的i 变为12
          20+12 =32；
          代码执行完毕，当代作用域没被引用，随之销毁

      window不关闭 变量f 不销毁      
    ===========================================================================================
    fn()(10) 调用执行：
      形成新的私有作用域B：
      1.变量提升 var i,
      2.代码执行：
        i= 10
        return 一个函数，相当于开辟新的内存空间（xxxfff222）(10)
          1.形参赋值 n =10;
          2.代码执行：
            10+（++i）->当前作用域没变量 i ,找上级作用域A， ++i 使B中的i 变为11
            10+11 = 21
            代码执行完毕，当代作用域没被引用，随之销毁 ,作用域B没被引用也随之销毁
    ===========================================================================================
     fn()(20) 调用执行：
      形成新的私有作用域C：
      1.变量提升 var i,
      2.代码执行：
        i= 10
        return 一个函数，相当于开辟新的内存空间（xxxfff333）(20)
          1.形参赋值 n =20;
          2.代码执行：
            20+（++i）->当前作用域没变量 i ,找上级作用域A， ++i 使B中的i 变为11
            20+11 = 31
            代码执行完毕，当代作用域没被引用，随之销毁 ,作用域C没被引用也随之销毁        

    ==========================================================================================
    函数每次执行都会形成私有作用域

# this
  this 是谁 和函数在哪定义在哪执行的都没有关系；
  js中的this 代表的是当前行为执行的主体 me.eat() this->me
  如何区分this：
    1. 函数执行，首先看函数名前是否有 . ,有的话， .前面是谁，this就是谁，没有，this就是window
    2. 自执行函数里面的this 永远是window
    3. 给元素的某一个事件绑定方法，该方法触发的时候，this就是元素
  
# 单例模式  
  //把描述同一个事物（同一个对象）的属性和方法放在一个内存空间下，起到了分组的作用，这样不同事物间的属性即使属性名相同，互相也不会发生冲突
  //我们把这种分组编写代码的模式叫做单例模式
  //单例模式（防止命名空间的冲突，也叫命名空间分组） 解决了分组的作用，但不能实现批量生产 
   var person1 = {
        name: '小明',
        age: 12
    }
    var person2 = {
        name: '小红',
        age: 20
    }
  //单例模式是开发项目中常用的模式，因为项目中我们可以用单例模式来进行我们的“模块化开发”    
# 工厂模式    
   把实现同一件相同事情的代码放到一个函数中，
   函数的封装=》"低耦合高内聚"：减少页面中的冗余代码，提高代码的重复利用率，命名空间分组

  //js 是一门轻量级的脚本‘编程语言’（HTML+css属于标记语言。不是编程语言）
  // .net (刀奈特) c#(c沙浦)
  //所有编程语言都是面向对象发开的 -》类的继承、封装、多态
  //继承： 子类继承父类的属性与方法
  //多态： 当前方法的多种形态 - >后台语言中：多态包含重载和重写，，，
  //js中不存在重载，方法名一样，后面会把前面的覆盖掉，最后只保留一个
  //js中有一个操作。，类似重载，但不是重载： 我们可以根据参数的不同，实现不同的功能
  //重写：子类重写父类的方法,         js中有重写
#构造函数  
 
  构造函数的目的就是为了创建一个自定义类，并且创建这类的实例

  构造函数与工厂模式的区别：
    1、执行的时候：
      工厂模式是普通函数执行
      构造函数是 new 函数名，通过new 就是一个类，执行的返回值就是一个实例
    2、函数执行的时候：
      相同点： 都是形成私有作用域，然后形参赋值，预解释，代码从上到下执行
      不同点： 构造函数 不用手动写，浏览器会自己默认创建一个对象数据类型值（这个对象就是当前类的实例）   

  **js中所有的类都是函数数据类型的，它通过new 变成一个实例，但是它本事也是一个普通的函数
    js中所有的实例都是对象数据类型的
  for example:
    function CreateJsPerson(name,age){
    //  var this = {} 
      this.name = name;
      this.age = age;
      this.writeCode =function(){
        console.log(this.name)
      }
    //  return this //这个对象就是当前类的一个实例

    }
    var  p1 = new CreateJsPerson('小明',20)
    var  p2 = new CreateJsPerson('小红',10)
    p1.writeCode()
    p2.writeCode()
    console.log(p1.writeCode === p2.writeCode) //false
  
    p1 和 p2 都是 CreateJsPerson 这个类的实例，所以都拥有writeCode 这个方法，但不同实例之间的方法不同 

    在类中给实例增添的属性（this.xxx=xxx） 属于当前实例的私有属性，实例与实例之间是单独的个体，所以私有属性之间是不相等的  
  
    var  res = CreateJsPerson('风筝',30) //这是普通函数执行，由于没写return ，所以是undefined ，这个方法中的this 是window
#构造函数 扩展

  function Fn(){
     var num = 10; 
      this.x = 100;
      this.getX = function(){
        console.log(this.x)
      }
      return  100 
    } 
  1. var f1 = new Fn; //在构造函数中不需要传参，括号可省却    
  2. var ff = f1.getX;
    ff() //this->window  
  3. console.log(f1.num)  //定义的变量与实例没有任何关系，只是当前形成私有作用域中的私有变量
  4. // 如果我们自己手动写return ,如果是基础数据类型如：数字 字符串 布尔值，函数返回的还是实例；如果return是引用类型，返回的就不是实例，而是该对象
  5. instanecof :检测某一个实例是否属于类
     console.log(f1 instanceof Fn) //true
     console.log(f1 instanceof Array) //false
     console.log(f1 instanceof Object) //true  每个对象数据类型都是Object这个内置类的实例
  6. 检测某一个属是否属于这个对象 attr in object(不管私有属性还是公有属性都可以))  
       console.log('x' in f1) //true
  7. hasOwnProperty()检测某一个属性是否属于这个对象私有属性 
      console.log(f1.hasOwnProperty('getX'))
    检测某一个属性是这个对象的公有属性 hasPubProperty()
       function  hasPubProperty(obj,attr){
        // 保证是他的属性并且不是私有属性，那么就是公有属性
        return  (attr in obj) && !obj.hasOwnProperty(attr)
        
      }
      console.log(hasPubProperty(f1,'getX'))
  8. isPrototypeof: 检测一个对象是否是另一个对象的原型。或者说一个对象是否被包含在另一个对象的原型链中    
#原型模式
  构造函数模式拥有了类和实例的概念，实例与实例之间相互独立开的 ->实例识别

  原型模式解决了属性或者方法的公有问题，把实例中相同的属性与方法提取成公有属性
  一：牢记原型链三要素：
    1.每一个函数数据类型（普通函数、类）都有一个天生自带的属性： prototype（原型），并且这个属性是一个对象数据类型的值
    2.并且在prototype上浏览器天生给它增加了一个属性constructor(构造函数)，属性值是当前函数（类）的本身
    3.每一个对象数据类型（普通对象/实例、prototype。。。），天生自带一个属性 __proto__,这个属性值是当前实例所属类的原型  
  for example:
    function Fn(){
      this.x=100;
    }  
    Fn.prototype.getX = function() {
      console.log(this.x)
    }
    var f1 = new Fn;
    var f2= new Fn;
    console.log(Fn.prototype.constructor === Fn) //true  印证 1 2 条
  二：  Object是所有对象数据类型的基类
     1. f1 instanceof Object ->true;因为f1通过__proto__可以向上级查找 先找到fn.prototype,因为prototype是对象数据类型，它也有__proto__,继续向上找，当前所属实例示Object的原型
     2. Object.prototype上没有__poroto__
  三：原型链模式：
    f1.hasOwnProperty('x')// true  说明hasOwnProperty是f1的一个属性
    //但是在f1私有属性中没有这个方法
    //通过 对象名.属性名 的方法获取某个属性值时候，首先在对象的私有属性查找，如果私有中存在这个属性，获取的是私有属性值，
    //如果私有属性中没有，则通过__proto__找到所属类的原型（类的原型上定义的属性和方法都是当前实例的公有的属性和方法），原型上有的话，获取公有属性
    // 如果原型没有。继续向原型的__proto__继续向上找，一直找到Object.prototye为止，还没有 undefined

    console.log(f1.getX ===f2.getX)//true //当前私有没有，通过__.proto__去找,
    console.log(f1.__proto__.getX ===f2.getX)  //f1.__proto__ (忽略私有直接找公有)就是当前实例 Fn.prototype  -> true
    console.log(f1.getX === Fn.prototype.getX)//true

    //f1.hasOwnProperty()->f1.__porto__.__porto__.hasOwnProperty()
    //在IE浏览器，原型模式也是同理，但IE怕你通过__proto__把公有属性修改，禁止我们使用__proto__
    f1.sum=function(){
      //修改私有属性
    }
    f1.__proto__.sum =function(){
      //修改公有属性 但ie不支持
    }
    Fn.prototype.sum=function(){
      //修改公有属性 兼容所有浏览器
    }

    
    在原型模式中 this常用的有两种情况：
    1.在类中 this.xxx=xxx this->当前的实例
    2.某个方法中的this-> 看执行的时候“.”前面是谁，this就是谁
      1)第一步先确定this的指向
      2）把this替换成对应的代码
      3）按照原型链查找机制，一步步查找结果