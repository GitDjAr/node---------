/**
 * 前置知识
 * exports 和 module.exports 的区别
 * 首先exports , module.exports 都是指向同一个对象
 * exports === module.exports === {}
 * 
 * node对js文件注入的变量
 * module = {
 * exports: {}
 * }
 * exports = module.exports
 * 
 * 绕了一圈下来其实没有什么区别
 * 唯一区别就是少写几个字,
 * exports 只是module.exports的简写
 * 但是如果改变了exports 对象,导致引用module.exports 失效,
 * 那么最终导入的结果以module.exports为准
 * eg:  exports = {a:10}
 *      module.exports = {b:20}
 *      导出的结果为 => {b:20},exports 将抛弃
 * 
 * 
 * 总结一下，在 Node.js 模块里，真正控制模块导出的是 module.exports，exports 只是 module.exports 决定导出一个对象时的一个快捷方式，
 * 假如 module.exports 导出其它类型的数据，比如字符串、数值、函数等等，则 exports 的存在没有意义。
 * 这是 Node.js 模块与 CommonJS 差异的一点，在 CommonJS 规范里，是只有 exports，没有 module.exports 的
 * https://blog.zfanw.com/differences-between-exports-module-dot-exports/
 */


const Koa = require('koa')
// const koaBody = require('koa-bodyparser')
const koaBody = require('koa-body')
const join = require('path').join
// 端口
const port = 2004
const { Host } = require('./utils/ip')
// 初始化实例
const app = new Koa()

app.use(koaBody({
  formidable: {
    maxFieldsSize: 200 * 1024 * 1024,//20M
    uploadDir: join(__dirname, './file'),
    keepExtensions: true,
  },
  multipart: true,
}))
// 导入路由
const Router = require('./route/main.js')(app)

// 开启端口监听
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
  console.log(`%chttp://${Host}:${port}`, 'color:#4186F4')
})
