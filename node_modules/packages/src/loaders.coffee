events   = require "events"
resolver = require "./resolver" 
type     = require "type-component"

class Loader
  
  ###
  ###

  constructor: (@_loadable, @_loaders) ->
    @_required = @_loadable.require or []
    @_load     = @_loadable.plugin


  ###
  ###

  require: (path) ->
    @_required

  ###
  ###

  load: () ->
    return @exports if @exports

    modules = []

    for moduleName in @_required
      modules.push @_loaders.load(moduleName)

    @exports = @_load(modules...) ? true




class Loaders extends events.EventEmitter

  ###
  ###

  constructor: (@packages) ->
    @_resolvers = []
    @_loaders = {}

  ###
  ###

  resolve: (path) ->
    return @_loaders[path] if @_loaders[path]
    for loadable in resolver.resolve(path)
      @_loaders[loadable.name] = new Loader(loadable, @)

  ###
  ###

  load: (search) ->
    t = type(search)
    if t is "array"
      multi = true
      search = search[0]

    modules = []

    if typeof search is "string"
      pkg = @_loadString(search)
      modules = [pkg]
      @packages[search] = pkg
    else
      tester = @getTester(search)
      for name of @_loaders
        if tester.test(name)
          modules.push @load(name)
          unless multi
            break


    if multi
      return modules
    else
      return modules[0]

  ###
  ###

  getTester: (search) ->
    if search.test or search instanceof RegExp 
      return search
    else if typeof search is "function"
      return { test: search }




  ###
  ###

  _loadString: (name) ->
    @resolve(name)

    loader = @_loaders[name]

    unless loader
      throw new Error "cannot load '#{name}'"

    @packages[name] = loader.load()

  ###
  ###

  loadAll: (next) ->
    for name of @_loaders
      @load(name)



module.exports = Loaders