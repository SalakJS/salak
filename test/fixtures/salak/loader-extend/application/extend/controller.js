module.exports = (app) => {
  return {
    say (name) {
      return `controller-${name}`
    }
  }
}
