module.exports = {
  bootstraps: [
    'blog'
  ],
  swagger: {
    enable: false
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
