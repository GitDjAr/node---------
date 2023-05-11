const fs = require("fs"),
  path = require("path");

/**
 * 删除文件夹功能
 * @param  {String} url  文件路径，绝对路径
 * @param  {boolean} isDir | false  是否清除文件夹
 * @return {Promise}   
 * @author huangh 20170123
 */
// deleteDir('/Users/huanghui/Documents/Nodejs/test/deletefile/test/',false);
function deleteDir(url, isDri = false,) {
  return new Promise((resolve, reject) => {
    var files = [];
    if (fs.existsSync(url)) {  //判断给定的路径是否存在
      files = fs.readdirSync(url);   //返回文件和子目录的数组
      files.forEach(function (file, index) {
        var curPath = path.join(url, file);
        if (fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
          if (['file', '/file'].includes(file))
            return

          // 同样删除文件夹,不然会解压失败
          deleteDir(curPath, true);
        } else {
          fs.unlinkSync(curPath);    //是指定文件，则删除
        }
      });
      //是否 清除文件夹
      if (isDri) {
        fs.rmdirSync(url);
      }
    } else {
      console.log("给定的路径不存在！");
      // reject('给定的路径不存在！');
    }
    resolve(true);
  })
}
// 判断盘符 绝对路径相对路径
function isAbsolutePath(strPath) {
  return strPath.startsWith('/') || /^[a-zA-Z]:\\/.test(strPath);
}

// 判断 linux shell 绝对路径相对路径
function isAbsoluteShellPath(strPath) {
  return /^\/\w+/.test(strPath)
}

module.exports = {
  deleteDir,
  isAbsolutePath
}
