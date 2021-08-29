import Router from '@koa/router'
import fs from 'fs'
import path from 'path'

const router = new Router()

const appDir = path.dirname(require.main.filename)
const file = appDir + '/../files/sample.zip'

console.log(file)

router.get('/', (ctx) => {
  const src = fs.createReadStream(file)
  ctx.response.set('Content-disposition', 'attachment; filename=sample.zip')
  ctx.body = src
})

module.exports = router
