/**
 * 请求
  方法：POST
  路径：/file
  参数：
  path（必需）：解压文件的目标路径。
  restart（可选）：如果为 true，则在解压完成后重启服务。
  响应
  状态码：200
  数据：
  code：结果代码，0 表示成功，2 表示解压失败。
  message：结果描述。
 */

  const KoaRouter = require('koa-router');
  const extractZip = require('extract-zip');
  const path = require('path');
  const { deleteDir, isAbsolutePath } = require('../../utils/delete');
  
  const updateRouter = new KoaRouter();
  
  updateRouter.post('/file', async (ctx, next) => {
    console.log('Update file');
    const { files, body } = ctx.request;
    const { file } = files;
    const { path: targetPath, restart } = body;
  
    if (file) {
      if (Array.isArray(file)) {
        // 处理多个文件上传
        file.forEach(item => { });
      } else {
        try {
          const cd = path.join(process.cwd(), '../');
          const dir = path.join(isAbsolutePath(targetPath) ? targetPath : cd, targetPath);
  
          deleteDir(dir, true);
          await extractZip(file.path, { dir });
  
          ctx.resContent.message = '解压成功: ' + dir;
        } catch (error) {
          ctx.resContent.code = 2; 
          ctx.resContent.message = error;
        }
      }
    }
  
    if (restart) {
      ctx.resContent.message = '重启成功!';
    }
  
    await next();
  });
  
  module.exports = updateRouter;
  