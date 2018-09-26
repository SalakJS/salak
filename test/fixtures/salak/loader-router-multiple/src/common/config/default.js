module.exports = () => {
  const config = {}

  config.routes = {
    defaultRoute: 'user/rbac'
  }

  config.bootstraps = [
    'user',
    'blog'
  ]

  config.middleware = [
    'a'
  ]

  return config
}
