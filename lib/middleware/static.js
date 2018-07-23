const server = require('koa-static')

module.exports = ({ root, opts }, app) => server(root, opts)
