const log  = require('../utils/log')
class RObj {
  error(e) {
    // 写入日志
    log(e)
    return  new Error(e)
  }
  msg(val) {
    const map = {
      0: '未知错误',
      1: '成功',
      2: '存储错误'
    }
    return map[val]
  }
  state(v) {
    return v
  }
  token() {

  }
}
const R = new RObj()
module.exports = (ctx,req,res,next,code = 1)=>{
  return {
    msg:R.msg(code),
    code:R.state(code)
  }
}