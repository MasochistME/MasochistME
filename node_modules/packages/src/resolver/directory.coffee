fs = require "fs"

class DirectoryResolver extends require("./base")

  ###
  ###

  constructor: (@_dir) ->

  ###
  ###

  resolve: () ->
    packages = []

    for file in fs.readdirSync(@_dir)
      continue if file is ".DS_Store"
      fp = @_dir + "/" + file
      pkg = require fp
      pkg.name = file
      packages.push pkg

    packages


  ###
  ###

  @test: (name) ->
    try 
      return fs.statSync(name).isDirectory()
    catch e
      return undefined


module.exports = DirectoryResolver