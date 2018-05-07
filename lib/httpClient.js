const superagent = require('superagent')
const EventEmitter = require('events')

class HttpClient extends EventEmitter {
  constructor (options = {}) {
    super()

    this.timeout = options.timeout || 0
    this.headers = options.headers
    this.contentType = options.contentType
    this.dataType = options.dataType
    this.retry = options.retry || 0
    this.redirects = options.redirects
  }

  request (url, {
    method = 'GET',
    timeout = this.timeout,
    body,
    query,
    headers,
    contentType = this.contentType,
    dataType = this.dataType,
    retry = this.retry,
    redirects = this.redirects
  } = {}) {
    let req = superagent(method, url)

    if (this.headers || (headers && typeof headers === 'object')) {
      req = req.set(Object.assign({}, this.headers, headers))
    }

    if (contentType && ['form', 'json'].indexOf(contentType) !== -1) {
      req = req.type(contentType)
    }

    if (query) {
      req = req.query(query)
    }

    if (body) {
      req = req.send(body)
    }

    if (retry) {
      req = req.retry(retry)
    }

    if (redirects !== undefined) {
      req = req.redirects(redirects)
    }

    if (timeout) {
      req = req.timeout(timeout)
    }

    this.emit('request', req)
    return new Promise((resolve, reject) => {
      req.end((err, res) => {
        let jsonErr
        let status = res && res.statusCode
        let data = res && res.text
        if (dataType === 'json') {
          try {
            data = JSON.parse(data)
          } catch (err) {
            jsonErr = err
          }
        }

        this.emit('response', res)
        resolve({
          status,
          data,
          err: jsonErr || err,
          headers: (res && res.headers) || {}
        })
      })
    })
  }
}

module.exports = HttpClient
