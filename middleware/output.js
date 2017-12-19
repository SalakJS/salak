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
