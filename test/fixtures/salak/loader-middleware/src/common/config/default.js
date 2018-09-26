module.exports = () => {
  const config = {}

  config.bootstraps = [
    'user'
  ]

  config.middleware = [
    'a',
    'b',
    'c',
    {
      name: 'd',
      package: require('../middleware/d')
    },
    'e',
    'f'
  ]

  config.a = {
    enable: false
  }

  config.b = {
    match: '/user/b'
  }

  config.c = {
    ignore: '/user/c'
  }

  config.d = {
    match: (ctx) => {
      if (ctx.header['user-agent'].indexOf('node') !== -1) {
        return true
      }

      return false
    }
  }

  config.e = {
    match: /user\/e/
  }

  config.f = {
    match: [
      /user\/f/,
      '/user/g'
    ]
  }

  return config
}
