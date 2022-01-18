const path = require('path')
const fs = require('fs');
// 批量导入路由地址
module.exports = ()=> {
  const PathList = []
  const Lspath = path.join(__dirname,'./module-route')
  fs.readdirSync(Lspath).forEach(fileName=>{
    PathList.push({
      wholePath:path.join(Lspath,fileName),
      fileName:fileName.split('.')[0],
      father:Lspath
    })
  })
  return PathList
}