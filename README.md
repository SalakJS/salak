# salak

web应用框架，基于koa 2.0

支持node v7.6 以上版本

## 特性

- ✔︎ 自动路由，基于controller自动绑定路由
- ✔︎ swagger文档自动生成
- ✔︎ Joi校验，自动校验数据请求
- ✔︎ model, service自动装载
- ✔︎ 内置丰富的插件，如error, jsonp等

## 安装

```
npm install --save salak
```

## 使用

### 目录结构

```
├── common                  - 公共模块
│   ├── config              - 配置文件
│   │   └── default.js
│   └── middleware
│       └── error.js
├── blog                    - blog模块
│   ├── config              - blog模块配置
│   │   └── default.js
│   ├── controller          - 控制器目录
│   │   ├── comment.js
│   │   └── post.js
│   ├── middleware          - 模块中间件
│   │   ├── auth.js
│   │   └── err.js
│   └── service             - 模块service
│       └── post.js
└── index.js                - 程序入口
```

@Todo 更详细文档参考

## License

MIT
