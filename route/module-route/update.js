const Router = require('koa-router')
const update = new Router()
const extractZip = require('extract-zip')
const join = require('path').join
const {deleteDir,isAbsolutePath} = require('../../utils/delete')
// const url = require('URL')
// const isAbsoluteUri = (strUri)=>{
//   const Uri = new url()
//   return Uri.is(strUri)
// }
// 更新info 路由地址
update.post('/file', async (ctx, next) => {
  console.log('update file');
  const file = ctx.request.files.file
  // TODO:项目路径,相对路径,
  const Path = ctx.request.body.path
  // 是否 重启
  const restart = ctx.request.body.restart
  if (file) {
    // 是否多个文件
    if (Array.isArray(file)) {
      // 后续处理
      file.forEach(item => { })
    } else {
      const filesPath = file.path
      // 需要返回上一级目录
      const cd = join(process.cwd(), '../')
      try {
        const Dir = join(isAbsolutePath(Path) ? Path :cd, Path)
        // 删除原来项目
        deleteDir(Dir, true)
        await extractZip(filesPath, { dir: Dir })
        ctx.resContent.message = '解压成功:' + Dir
      } catch (error) {
        ctx.resContent.code = 2
        ctx.resContent.message = error
      }
    }
  }
  if (restart) {
    ctx.resContent.message = '重启成功!'
  }
  next()
})
module.exports = update