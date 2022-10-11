const fs = require('fs')

function delDirPath(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file) => {
      const curPath = `${path}/${file}`
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        delDirPath(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

module.exports.delDirPath = delDirPath
