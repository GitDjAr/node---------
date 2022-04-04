// 执行以下命令
// del dist/nodeAutoDeploy.zip && 7z a dist/nodeAutoDeploy.zip  ./ && curl http://www.xn--lg3a.top:82/update/file -F file=@dist/nodeAutoDeploy.zip -F path=/usr/local/nginx/html/nodeAutoDeploy
// 参数说明
// file: 文件
// path: 项目路径
// restart: 是否重启

"use strict";
const exec = require('child_process').exec;
const join = require('path').join
const fs = require('fs')
const { formatTime } = require('../utils/Timefatma.js')
const { deleteDir, isAbsolutePath } = require('../utils/delete')

// 全局路径  npm 变量
// node config/dep.config.js --Path=dist
const Path = process.env.npm_package_config_Path || 'dist'
const Dir = join(isAbsolutePath(Path) ? Path : process.cwd(), Path)


// 写入错误日志
const writeError = (error) => {
  const err = `${formatTime(new Date())}--${error}\r\n`
  fs.writeFileSync('./log/error.log', err, {
    encoding: 'utf8',
    flag: 'a'
  })
}

function DelFile() {
  console.log('删除路径:', Dir);
  return deleteDir(Dir)
}

// https://blog.csdn.net/hellokandy/article/details/108800268
function zip() {
  return new Promise((resolve, reject) => {
    const dist = join(process.cwd(), 'dist/nodeAutoDeploy.zip')
    const p = join(process.cwd(),'/*')
    exec(`7z a ${dist}  ${p} `, (err, stdout, stderr) => {
      if (err) {
        writeError(err)
        console.log('压缩失败,放弃压缩,如有疑问查看error.log');
        reject(err)
      } else {
        console.log('压缩完成:',p );
        resolve(true)
      }
    })
  })
}

function update() {
  return new Promise((resolve, reject) => {
    exec('curl http://www.xn--lg3a.top:82/update/file -F file=@dist/nodeAutoDeploy.zip -F path=../nodeAutoDeploy',(err,stdout,stderr)=>{
      if(err){
        writeError(err)
        console.log('curl 执行错误,详情请看error.log');
        reject(err)
      }else{
        console.log('上传完成');
        resolve(stdout)
      }
    })
  })
}

const run = async () => {
  try {
    await DelFile()
    await zip()
    const res = await update()
    console.log(res);
  } catch (error) {
    writeError(error)
    console.log('执行错误,详情请看error.log', error);
  }
}

run()