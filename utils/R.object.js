const log = require('../utils/log')
class RObj {
  error(e) {
    // 写入日志
    log(e)
    return new Error(e)
  }
  msg(val) {
    const map = {
      0: '未知状态',
      1: '成功',
      2: '存储错误',
      3: '网络错误'
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
module.exports = ({ ctx, code = 0, message = null }) => {


  return {
    msg: ctx?.message || message || R.msg(code),
    code: ctx?.code || R.state(code)
  }
}
