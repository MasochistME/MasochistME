PackageLoaders = require "./loaders"

class Packages

  ###
  ###

  constructor: () ->
    @exports  = {}
    @_loaders = new PackageLoaders @exports

  ###
   loads a package path
  ###

  require: (path) -> 
    @_loaders.resolve path
    @

  ###
   loads the packages
  ###

  load: (next) -> 
    @_loaders.loadAll next
    @


module.exports = () -> new Packages()