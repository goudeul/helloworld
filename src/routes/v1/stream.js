import Router from '@koa/router'
import auth from '../../middlewares/auth'
import fs from 'fs'
import path from 'path'

const router = new Router()

const appDir = path.dirname(require.main.filename)
const file = appDir + '/file/sample.zip'

/*router.get('/', auth['all'], (ctx, next) => {
  const src = fs.createReadStream(file)
  ctx.response.set('content-type', 'text/html')
  ctx.body = src
})*/

router.get('/', (ctx, next) => {
  const src = fs.createReadStream(file)
  ctx.response.set('Content-disposition', 'attachment; filename=sample.zip')
  ctx.body = src
})

module.exports = router
