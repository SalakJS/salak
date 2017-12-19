'use strict'

/**
 * swagger 文档生成器
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const { generateSwaggerSpec } = require('salak-swagger')

const defaultSwaggerOptions = {
  apiDocs: '/api-docs',
  json: '/api-json',
  html: `
<!DOCTYPE html>
<html>
  <head>
    <title>Documents</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='/api-json'></redoc>
    <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
  </body>
</html>
  `
}

/**
 * @param {Object} options 配置
 * @param {string} options.apiDocs 文档地址
 * @param {string} options.json 文档json地址
 * @param {string} options.html 文档渲染样式
 */
module.exports = (options, app) => {
  options = Object.assign({}, defaultSwaggerOptions, options)

  const json = generateSwaggerSpec(app.routesDefinitions, options.spec)
  app.router.get(options.json, async (ctx, next) => {
    ctx.body = json
  })

  app.router.get(options.apiDocs, async (ctx, next) => {
    ctx.body = options.html
  })
}
