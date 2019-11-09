CONFIG = require 'config'
__ = CONFIG.universalPath
_ = __.require 'builders', 'utils'
{ Promise } = __.require 'lib', 'promises'
getWorksFromAuthorsLabels = require './get_works_from_authors_uris'
{ getAlreadyResolvedUris, ifSomeLabelsMatch, getLabels, resolveSeed } = require './helpers'
getAuthorsUris = require '../get_authors_uris'

module.exports = (works, authors)->
  worksAuthorsUris = _.compact _.flatten(works.map(getAuthorsUris))
  authorsUris = _.uniq getAlreadyResolvedUris(authors).concat(worksAuthorsUris)
  Promise.all works.map(resolveWork(authorsUris))

resolveWork = (authorsUris)-> (work)->
  if work.uri? or _.isEmpty(authorsUris) then return work
  workSeedLabels = getLabels work
  Promise.all getWorksFromAuthorsLabels(authorsUris)
  .filter ifSomeLabelsMatch(workSeedLabels)
  .then resolveSeed(work)
