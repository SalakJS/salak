const constants = require('../util/constants')

module.exports = ({
  fields,
  type,
  errorHtmlFn
}, app) => {
  fields = Object.assign({}, constants.OUTPUT_JSON_FIELDS, fields)
  if (typeof errorHtmlFn !== 'function') {
    errorHtmlFn = (code, err, env = app.env) => {
      return `<!DOCTYPE html>
<html>
<head>
  <title>Error - ${code}</title>
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    body {
      padding: 50px 80px;
      font: 14px "Helvetica Neue", Helvetica, sans-serif;
    }
    h1, h2 {
      margin: 0;
      padding: 10px 0;
    }
    h1 {
      font-size: 2em;
    }
    h2 {
      font-size: 1.2em;
      font-weight: 200;
      color: #aaa;
    }
    pre {
      font-size: .8em;
    }
  </style>
</head>
<body>
  <div id="error">
    <h1>Error</h1>
    <p>Looks like something broke!</p>
${env === 'development' &&
    `<h2>Message:</h2>
    <pre>
      <code>${err.message}</code>
    </pre>
    ${(err.stack &&
      `
    <h2>Stack:</h2>
    <pre>
      <code>${err.stack}</code>
    </pre>`) || ''}
`}
  </div>
</body>
</html>
`
    }
  }

  const parseCode = type && type.code === 'string' ? (code) => '' + code : (code) => code

  const keys = Object.keys(constants.OUTPUT_JSON_FIELDS)
  const output = (data) => {
    const body = {}

    keys.forEach((key) => {
      const value = data[key]
      if (value) {
        body[fields[key]] = key === 'code' ? parseCode(value) : value
      }
    })

    return body
  }

  return {
    app: {
      outputJson: (code, data, msg, details) => {
        return output({ code, data, msg, details })
      },
      outputErrorHtml: (code, err = {}) => {
        return errorHtmlFn(code, err)
      }
    }
  }
}
