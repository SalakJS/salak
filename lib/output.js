const Joi = require('salak-router').Joi

/**
 * 框架默认输出，防止output中间件被重写
 */
module.exports = (code, msg, data, details) => {
  return {
    code,
    msg,
    data,
    details
  }
}

/**
 * 成功返回时schema定义，只需要传入data的schema
 */
module.exports.makeOutputSchema = (data) => {
  if (data && !data.isJoi) {
    data = Joi.object().keys(data).required()
  }

  return Joi.object().keys({
    code: Joi.number().required(),
    msg: Joi.string().required(),
    data
  })
}
