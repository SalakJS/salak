module.exports = (app) => {
  const config = {}

  config.readyTimeout = 5000

  config.bootstraps = [
    'api'
  ]

  config.middleware = [
    'test'
  ]

  config.schedule = {
    enable: false
  }

  config.routes = {
    defaultRoute: 'api/user',
    replaceIndex: false,
    defaultMethods: ['GET']
  }

  return config
}
