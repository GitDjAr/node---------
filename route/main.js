const Router = require('koa-router')
const Interceptor = require('./interceptor')
// 初始化
const home = new Router()
home.get('/', async (ctx, next) => {
  console.log('121');

})

const page = new Router()
page.get('/index', async (ctx, next) => {
  ctx.body = 'index.html'
})

//装载路由(组装子路由为一个整体--注釋)
const Routers = new Router()
Routers.use('/', home.routes(), home.allowedMethods())
Routers.use('/page', page.routes(), page.allowedMethods())
// 批量导入
const routePathList = require('./import-route')()
routePathList.forEach(({ fileName, wholePath }) => {
  const obj = require(wholePath)
  Routers.use(`/${fileName}`, obj.routes(), obj.allowedMethods())
})

// console.log(Routers);
/**
 * 调用实例:  文件名称 + 路由地址
 * http://198.18.0.1:2004/ai/ai
 * http://198.18.0.1:2004/update/file
 */
module.exports = (app) => {
  // 挂载路由到koa实例
  app
    .use(Interceptor)
    .use(Routers.routes())
    .use(Routers.allowedMethods())
}
