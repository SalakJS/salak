'use strict'

/**
 * output插件，用于设置json输出默认字段名称
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

const defaults = {
  code: 'code',
  msg: 'msg',
  data: 'data',
  details: 'details' // 用于描述验证相关错误信息
}

module.exports = (options, app) => {
  options = Object.assign({}, defaults, options)

  app.output = (code, msg, data, details) => {
    const obj = {
      [options.code]: code
    }

    if (msg) {
      obj[options.msg] = msg
    }

    if (data) {
      obj[options.data] = data
    }

    if (details) {
      obj[options.details] = details
    }

    return obj
  }
}
