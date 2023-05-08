const Router = require('koa-router');
const extractZip = require('extract-zip');
const path = require('path');
const { deleteDir, isAbsolutePath } = require('../../utils/delete');

const update = new Router();

update.post('/file', async (ctx) => {
  try {
    const { files:{file}, path: filePath, restart } = ctx.request.body;

    if (!file) {
      ctx.throw(400, '没有文件uploade');
    }

    const isMultipleFiles = Array.isArray(file);

    if (isMultipleFiles) {
      // Handle multiple files here
        ctx.body = { message: '目前不支持多文件上传' };
      return;
    }

    const filesPath = file.path;
    const absolutePath = isAbsolutePath(filePath) ? filePath : path.join(process.cwd(), '..', filePath);

    deleteDir(absolutePath, true);
    await extractZip(filesPath, { dir: absolutePath });

    ctx.body = { message: '文件更新成功' };

    if (restart) {
      // Restart the server here
    }
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

module.exports = update;
