resolverFactory = require "./factory"
toarray         = require "toarray"

exports.resolve = (path) ->
  resolver = resolverFactory.create(path)

  unless resolver
    throw new Error "unable to resolve '#{path}'"
    
  toarray resolver.resolve()

