module.exports = {
  bootstraps: [
    'frontend'
  ],
  routes: {
    defaultRoute: 'frontend/comment'
  },
  httpClient: {
    timeout: 1000
  },
  swagger: {
    // enable: false,
    spec: {
      info: {
        title: '博客API',
        description: '博客具体内容',
        version: '1.0.0'
      },
      tags: [
        {
          name: 'Post',
          description: '文章'
        },
        {
          name: 'Comment',
          description: '评论'
        }
      ]
    }
  }
}
