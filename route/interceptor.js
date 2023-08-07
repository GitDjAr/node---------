const R = require('../utils/R.object');

/**
 * req 请求拦截  res 响应拦截
 */
module.exports = async (ctx, next) => {
  console.log('请求拦截');
  console.log(ctx.request.body);
  let T = Date.now()
  // await new Promise(resolve=>{
  //   setTimeout(() => {
  //     resolve(1)
  //   }, 10000);
  // })
  // token 是否合理，过期,获取头信息等
  await next()

  console.log('响应拦截', ctx.body);
  const {
    body = {},
    message,
    code
  } = ctx.body
  ctx.body = {
    Head: {
      code: 1,
      ...R(ctx.body),
      Time: `${Date.now() - T}ms`
    },
    Content: body
  }
}
