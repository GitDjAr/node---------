const Router = require("koa-router")
const userRelated = new Router
userRelated.post('/login', async (ctx, next) => {
  const body = ctx.request.body
  if (body.user = 'admin' && body.password == '123') {
    ctx.body = {
      body: {
        token: 'kajshdkfhasd'
      },
      code: 1,
    }
  } else {
    ctx.body.message = '账号或者密码错误'
  }
})
module.exports = userRelated
