# salak

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/salak.svg?style=flat-square
[npm-url]: https://npmjs.org/package/salak
[travis-image]: https://img.shields.io/travis/SalakJS/salak.svg?style=flat-square
[travis-url]: https://travis-ci.org/SalakJS/salak
[david-image]: https://img.shields.io/david/SalakJS/salak.svg?style=flat-square
[david-url]: https://david-dm.org/SalakJS/salak
[download-image]: https://img.shields.io/npm/dm/salak.svg?style=flat-square
[download-url]: https://npmjs.org/package/salak

web应用框架，基于koa 2.0

支持node v7.6 以上版本

## 特性

- ✔︎ 自动路由，基于controller自动绑定路由
- ✔︎ swagger文档自动生成
- ✔︎ Joi校验，自动校验数据请求
- ✔︎ model, service自动装载
- ✔︎ 内置丰富的插件，如error, jsonp等

## 文档

[https://salakjs.github.io/docs](https://salakjs.github.io/docs)

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

## License

MIT
