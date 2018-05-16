'use strict'

/**
 * json输出定义
 *
 * 创 建 者：wengeek <wenwei897684475@gmail.com>
 * 创建时间：2017-12-19
 */

/**
 * 框架默认输出，防止output中间件被重写
 *
 * @param {number} code 状态码
 * @param {string} msg 状态信息
 * @param {Object} data 接口数据
 * @param {Object} details 错误具体信息，一般在joi校验失败或mongodb操作失败时出现
 * @return {Object}
 */
module.exports = (code, msg, data, details) => {
  return {
    code,
    msg,
    data,
    details
  }
}
