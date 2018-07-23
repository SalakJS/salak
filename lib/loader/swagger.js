const LoaderInterface = require('./loader_interface')
const { generateSwaggerSpec } = require('salak-swagger')
const path = require('path')

class Swagger extends LoaderInterface {
  load () {
    const { enable, spec, apiJson, apiDocs, html } = this.app.config('swagger')
    const json = generateSwaggerSpec(this.app.routesDefinitions, spec)

    this.writeRuntimeFile(path.join('swagger', 'swagger.json'), json)

    if (enable !== false) {
      const paths = {
        [apiJson]: json,
        [apiDocs]: html
      }

      this.app.logger.debug(`Register Swagger: ${apiJson}, ${apiDocs}`)
      this.app.use(async (ctx, next) => {
        if (ctx.method !== 'GET') {
          await next()
          return
        }

        const content = paths[ctx.path]

        if (content) {
          ctx.body = content
          return
        }

        await next()
      })
    }

    return json
  }
}

module.exports = Swagger
