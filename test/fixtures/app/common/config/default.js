module.exports = {
  bootstraps: [
    'blog'
  ],
  swagger: {
    spec: {
      info: {
        title: 'Blog api',
        description: 'All apis for blog',
        version: '1.0.0'
      }
    }
  },
  logger: {
    injectConsole: false,
    capture: {
      enable: false,
      category: 'http',
      level: 'info'
    },
    defaultLevel: 'error'
  }
}
