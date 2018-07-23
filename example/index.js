const Salak = require('..')

const app = new Salak({
  baseDir: __dirname,
  opts: {
    root: 'common'
  }
})

app.beforeStart(async () => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 0)
  })
})

app.run()
