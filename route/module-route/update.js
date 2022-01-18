const Router = require('koa-router')
const KoaBody = require('koa-body')
const update = new Router()
// 更新info 路由地址
update.post('/file',async (ctx ,next)=>{
  // console.log(KoaBody(ctx.request.body),ctx);\
  console.log('ctx :>> ', ctx);
  await next()
  ctx.body = {
    Content:{
      list:[1,2,4]
    }
  }
})
module.exports  = update