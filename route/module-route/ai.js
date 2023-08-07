

/**
* gpt 回答规范
* 回复的代码内容,通过json描述
* {
  filename: 'text.txt',
  filePath: './page',
  code: [
    {
      operate: 'appendFile' | 'unlink' | 'regexp', // 操作类型
      lineNumber: 5, // 行号
      content: 'Hello World' // 要添加/替换的内容
    }
  ]
};
*/

const fs = require('fs-extra');
const path = require('path');
const Router = require("koa-router")
const readline = require("readline");

const AI = new Router


let logs = []

async function processFile(fileInfo) {
  try {
    const { filename, filePath: url, code } = fileInfo;
    const filePath = path.join(__dirname, `../../${url}/${filename}`);
    // 是否存在路径, 创建
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    //权限
    fs.chmodSync(filePath, 0o666);
    // logs.push('Processing file:' + filePath)

    const readStream = fs.createReadStream(filePath, 'utf8');
    const writeStream = fs.createWriteStream(filePath + '.tmp', 'utf8');

    writeStream.on('finish', () => {
      console.log('写入成功');
    });

    writeStream.on('error', (err) => {
      console.error('写入失败', err);
    });

    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    const modifiedLines = new Set();
    for await (const line of rl) {

      let modifiedLine = line;

      code.forEach(item => {
        if (item.operate === 'regexp' && item.lineNumber !== undefined && item.content !== undefined) {
          const regex = new RegExp(item.lineNumber, item.flags || 'i');
          modifiedLine = modifiedLine.replace(regex, item.content);
        } else if (item.operate === 'unlink' && item.lineNumber !== undefined) {
          if (line.includes(item.lineNumber)) {
            console.log('unlink');
            modifiedLine = '';
          }
        }
      });

      // 写入修改后的内容到临时文件
      writeStream.write(modifiedLine + '\n');

      // 记录被修改的行号，用于后续追加操作
      if (modifiedLine !== line) {
        modifiedLines.add(line);
      }
    }

    // 追加操作
    code.forEach(item => {
      if (item.operate === 'appendFile' && item.lineNumber !== undefined && item.content !== undefined) {
        // if (modifiedLines.has(item.lineNumber)) {
        console.log('追加');

        writeStream.write(item.content + '\n');
        // }
      }
    });

    // 关闭流
    readStream.close();
    writeStream.close();
    //可以显式调用 end() 方法关闭流:
    writeStream.end(async () => {

      // 将临时文件替换为原文件
      // await fs.rename(filePath + '.tmp', filePath);
    })

    // logs.push('File processed:' + filePath);

  } catch (err) {
    logs.push('Error occurred during file processing:' + err);
    // 进行错误处理，比如输出错误日志、回滚操作等
  }
}

AI.post('/ai', async (ctx, next) => {

  const fileList = ctx.request.body;

  try {
    for (const item of fileList) {
      await processFile(item);
    }
  } catch (err) {
    let f = 'Error occurred during processing files:' + err
    console.error(f);
    logs.push(f);
    // 进行错误处理，比如输出错误日志、回滚操作等
  }

  ctx.body = { code: logs.length ? 0 : 1, message: logs.join('\r\n') };
  console.log(logs);
  logs = []
  next()
})
module.exports = AI


// // 操作日志
// const log = `[${new Date()}]: 执行操作:${item.operate} \n`;
// fs.appendFileSync('src/log/logs.txt', log);
// 备份原文件
// const backupFilePath = `${filePath}/${filename}.bak`;
// fs.copyFileSync(filePath + '/' + filename, backupFilePath);
