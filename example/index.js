const Salak = require('..')

const app = new Salak({
  baseDir: __dirname
})

app.on('ready', () => {
  app.listen(3000)
})
