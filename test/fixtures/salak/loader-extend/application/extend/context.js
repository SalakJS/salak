module.exports = {
  get userAgent () {
    return this.header['user-agent']
  },
  say (name) {
    return `context-${name}`
  }
}
