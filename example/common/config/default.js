module.exports = {
  bootstraps: [
    'frontend'
  ],
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
