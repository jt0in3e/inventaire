const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('builders', 'utils')
const backupGeneralFolder = CONFIG.db.backupFolder
const fs = require('fs')

module.exports = () => {
  const day = _.simpleDay()
  const backupFolder = `${backupGeneralFolder}/${day}`

  try {
    fs.mkdirSync(backupFolder)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  return { backupFolder, backupGeneralFolder, day }
}
