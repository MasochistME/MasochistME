factories = require "factories"


module.exports = factories.any [
  require("./module"),
  require("./directory"),
  require("./obj")
]