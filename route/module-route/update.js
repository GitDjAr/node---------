const Router = require('koa-router')
const update = new Router()
const extractZip = require('extract-zip')
const join = require('path').join
const deleteDir = require('../../utils/delete')
// const url = require('URL')
// const isAbsoluteUri = (strUri)=>{
//   const Uri = new url()
//   return Uri.is(strUri)
// }
// 更新info 路由地址
update.post('/file', async (ctx, next) => {
  const file = ctx.request.files.file
  const Body = ctx.request.body
  if (file) {
    // 是否多个文件
    if (Array.isArray(file)) {
      // 后续处理
      file.forEach(item => { })
    } else {
      const filesPath = ctx.request.files.file.path
      try {
        const Dir = join(__dirname, `../../../${Body.path}`) 
        // 删除原来项目
        deleteDir(Dir,true)
        // TODO:项目路径,相对路径,后续通用,绝对,相对
        await extractZip(filesPath, { dir:Dir })
        ctx.resContent.message = '解压成功'
      } catch (error) {
        ctx.resContent.code = 2
        ctx.resContent.message = error
      }
    }
  }
})
module.exports = update