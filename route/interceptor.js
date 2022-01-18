const R = require('../utils/R.object');

/**
 * req 请求拦截  res 响应拦截
 */
module.exports = async (ctx, next) => {
  console.log('请求拦截');
  await next()
  const [req, res, code] = [ctx.req, ctx.res, 1]
  ctx.body.Head = R(ctx, req, res, next, code)
  console.log(ctx.body);
}