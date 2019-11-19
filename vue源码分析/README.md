# VUE 源码分析 ：

 # 准备知识
  - [].slice.call(lists)
   - 类数组转换数组，借用数组原型的slice方法， 截取指定长度 返回新数组
  - node.nodeType
  - Object.defineProprty
   - 兼容ie 9以上
  - Object.keys
    - 兼容ie 9以上
    - 返回一个给定对象的自身可枚举的属性组成的数组
    - MDN 有兼容ie678的 代码 例子
  - documentFragment
    - 表示没有父级文件的最小文档对象，操作它的children ，不会触发DOM的重新渲染。
    - 注意 在Dom 中 一个节点只能有一个父亲（操作dom中的节点到fragment中，dom就会消失）

  