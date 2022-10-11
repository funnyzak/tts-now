// lint-staged.config.js
// https://www.npmjs.com/package/lint-staged
// https://github.com/DavidAnson/markdownlint
// https://github.com/micromatch/micromatch
const micromatch = require('micromatch')

module.exports = (allStagedFiles) => {
  const shFiles = micromatch(allStagedFiles, ['**/src/**/*.sh'])
  if (shFiles.length) {
    return "printf '%s\n' \"Script files aren't allowed in src directory\" >&2"
  }

  const runScripts = []
  const codeFiles = micromatch(allStagedFiles, [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx'
  ])
  if (codeFiles.length > 0) {
    runScripts.push(`prettier --write ${codeFiles.join(' ')}`)
    runScripts.push(`eslint --fix --cache ${codeFiles.join(' ')}`)
  }

  const docFiles = micromatch(allStagedFiles, [
    '**/*.md',
    '**/*.html',
    '**/*.json',
    '**/*.css',
    '**/*.less',
    '**/*.scss',
    '**/*.sass'
  ])
  if (docFiles.length > 0) {
    runScripts.push(`prettier --write ${docFiles.join(' ')}`)
  }

  return runScripts
}
