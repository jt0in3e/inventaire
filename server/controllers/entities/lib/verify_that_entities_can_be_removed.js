const __ = require('config').universalPath
const _ = __.require('builders', 'utils')
const error_ = __.require('lib', 'error/error')
const entities_ = require('./entities')
const items_ = __.require('controllers', 'items/lib/items')
const getEntitiesByUris = require('./get_entities_by_uris')

const criticalClaimProperties = [
  // No edition should end up without an associated work because of a removed work
  'wdt:P629'
]

module.exports = uris => {
  return Promise.all([
    entitiesRelationsChecks(uris),
    entitiesItemsChecks(uris)
  ])
}

const entitiesRelationsChecks = uris => Promise.all(uris.map(entityIsntUsedMuch))

const entityIsntUsedMuch = uri => {
  return entities_.byClaimsValue(uri)
  .then(claims => {
    // Tolerating 1 claim: typically when a junk author entity is linked via a wdt:P50 claim
    // to a work, the author can be deleted, which will also remove the claim on the work
    if (claims.length > 1) {
      throw error_.new('this entity has too many claims to be removed', 400, uri, claims)
    }

    for (const claim of claims) {
      if (criticalClaimProperties.includes(claim.property)) {
        throw error_.new('this entity is used in a critical claim', 400, uri, claim)
      }
    }
  })
}

const entitiesItemsChecks = async uris => {
  const allUris = await getAllUris(uris)
  return Promise.all(allUris.map(entityIsntUsedByAnyItem))
}

const getAllUris = uris => {
  return getEntitiesByUris({ uris })
  .then(res => {
    if (res.redirects == null) return uris
    const missingCanonicalUris = _.values(res.redirects)
    return uris.concat(missingCanonicalUris)
  })
}

const entityIsntUsedByAnyItem = async uri => {
  const items = await items_.byEntity(uri)
  if (items.length > 0) {
    throw error_.new("entities that are used by an item can't be removed", 400, uri)
  }
}
