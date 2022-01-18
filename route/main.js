const Router = require('koa-router')
const Interceptor = require('./interceptor')
// const Update = require('./module-route/update')
// 初始化
const home = new Router()
home.get('/', async (ctx, next) => {
  ctx.body = {
    msg: ctx.query,
    string: ctx.request.querystring
  }
})

const page = new Router()
page.get('/index', async (ctx, next) => {
  ctx.body = 'index.html'
})

//装载路由(组装子路由为一个整体)
const Routers = new Router()
Routers.use('/', home.routes(), home.allowedMethods())
Routers.use('/page', page.routes(), page.allowedMethods())
// 批量导入
const routePathList = require('./import-route')()
routePathList.forEach(({ fileName, wholePath }) => {
  const obj = require(wholePath)
  Routers.use(`/${fileName}`, obj.routes(), obj.allowedMethods())
})


module.exports = (app) => {
  // 挂载路由到koa实例
  app
  .use(Interceptor)
  .use(Routers.routes())
  .use(Routers.allowedMethods())
}
