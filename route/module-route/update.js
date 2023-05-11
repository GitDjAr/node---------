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
const KoaRouter = require("koa-router");
const fs = require("fs");
const extractZip = require("extract-zip");
const path = require("path");
const { deleteDir, isAbsolutePath } = require("../../utils/delete");

const uploadRouter = new KoaRouter();


// 处理文件上传和提取
uploadRouter.post("/file", async (ctx, next) => {

  const { path: destPath, } = ctx.request.body;
  const file = ctx.request.files.file

  // console.log('ctx.file.path', ctx, ctx.req, isAbsolutePath(destPath));
  console.log('destPath', destPath, file, path?.resolve?.(destPath));

  // 检查如果destPath是一个绝对路径
  if (!isAbsolutePath(destPath)) {
    ctx.status = 400;
    ctx.body = {
      code: 200,
      message: "无效的路径。请提供一个绝对路径。",
    };
    return
  }

  try {
    // 检查是否有目的地的路径,如果没有创建它
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    // 提取将ZIP文件 解压到指定的路径
    await extractZip(file.path, { dir: path?.resolve?.(destPath) });
    // console.log('ctx.file.path', ctx.file.path, path?.resolve(destPath));


    // 清理上传压缩文件
    fs.unlinkSync(file.path);

    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: "文件提取成功。",
    };
  } catch (error) {
    console.log(error);
    // 在提取和清理期间处理错误
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "文件提取失败。",
    };
  }

  await next();
});

module.exports = uploadRouter;
