module.exports = (app) => {
  return {
    model (name, module) {
      console.log(name, module)
    }
  }
}
