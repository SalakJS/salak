const path = require('path')
const constants = require('../util/constants')

module.exports = (app) => {
  const { baseDir, env, version } = app
  const config = {}

  config.readyTimeout = constants.READY_TIMEOUT

  config.schedule = {
    prefix: 'salak-timer',
    store: 'memory',
    storeOptions: {
      pm2: 'INSTANCE_ID'
    }
  }

  config.swagger = {
    enable: env !== 'production',
    apiDocs: '/api-docs',
    apiJson: '/api-json',
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
    <redoc spec-url='./api-json'></redoc>
    <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
  </body>
</html>`,
    spec: {
      info: {
        title: 'salak',
        version
      }
    }
  }

  config.static = {
    root: path.join(baseDir, 'public'),
    opts: {}
  }

  config.siteFile = {
    '/favicon.ico': path.join(__dirname, 'favicon.ico')
  }

  config.logger = {
    root: path.join(baseDir, 'logs'),
    injectConsole: env === 'development',
    formatType: 'log4js',
    fileType: 'file',
    capture: {
      enable: true,
      category: 'http',
      level: 'auto'
    },
    defaultLevel: env === 'production' ? 'info' : 'debug'
  }

  config.notFound = {
    type: '',
    notFoundHtml: '',
    pageUrl: ''
  }

  // define json output
  config.output = {
    fields: constants.OUTPUT_JSON_FIELDS,
    type: { // support code: '0'
      code: 'number' // number or string, default 'number'
    }
  }

  config.error = {
    status: 'auto', // set by app http status
    type: ''
  }

  return config
}
