const { generateSwaggerSpec } = require('salak-swagger')

const defaultSwaggerOptions = {
  apiDocs: '/api-docs',
  json: '/api-json',
  html: `
<!DOCTYPE html>
<html>
  <head>
    <title>Documents</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--
    ReDoc doesn't change outer page styles
    -->
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
