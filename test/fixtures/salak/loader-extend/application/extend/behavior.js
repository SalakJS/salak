module.exports = {
  get isNumber () {
    return this.Joi.number().required()
  }
}
