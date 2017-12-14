type = require "type-component"

class ObjResolver extends require("./base")

  ###
  ###

  constructor: (@_target) ->

  ###
  ###

  resolve: () -> 
    return @_target if @_target.load
    packages = []
    for name of @_target then do (name) =>
      tg = @_target[name]
      packages.push 
        name: name
        plugin: () => tg
    packages



  ###
  ###

  @test: (target) -> 
    type(target) is "object"

module.exports = ObjResolver