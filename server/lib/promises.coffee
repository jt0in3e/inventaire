__ = require('config').universalPath
_ = __.require 'builders', 'utils'
Promise = require 'bluebird'
requests = require './requests'
shared = __.require('sharedLibs', 'promises')(Promise)

all = Promise.all.bind Promise
props = Promise.props.bind Promise

promisesHandlers =
  Promise: Promise
  all: Promise.all.bind Promise
  props: Promise.props.bind Promise
  Timeout: (ms)-> (promise)-> promise.timeout ms
  # skip throws in a standard way to be catched later
  # by catchSkip and not be treated as an error.
  # It can be used to pass over steps of a promise chain
  # made unnecessary for some reason
  skip: (reason, context)->
    err = new Error 'skip'
    err.skip = true
    err.reason = reason
    err.context = context
    throw err

  # a proxy to Bluebird Promisify that keeps the names
  promisify: (mod, keys)->
    # Allow to pass an array of the desired keys
    # or let keys undefined to get all the keys
    unless _.isArray keys then keys = Object.keys mod
    API = {}
    for k in keys
      API[k] = Promise.promisify mod[k]
    return API

# bundling NonSkip and _.Error handlers
promisesHandlers.catchSkip = (label)->
  catcher = (err)->
    if err.skip then _.log err.context, "#{label} skipped: #{err.reason}"
    else throw err

module.exports = _.extend {}, shared, requests, promisesHandlers
