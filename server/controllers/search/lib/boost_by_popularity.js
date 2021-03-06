const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('builders', 'utils')
const getEntitiesPopularity = __.require('controllers', 'entities/lib/get_entities_popularity')

module.exports = results => {
  const entityUris = _.compact(_.map(results, 'uri'))
  return getEntitiesPopularity(entityUris)
  .then(sortResultsByPopularity(results))
}

const sortResultsByPopularity = results => popularityByUri => {
  return results
  .map(setGlobalScore(popularityByUri))
  .sort((a, b) => b.globalScore - a.globalScore)
}

const setGlobalScore = popularityByUri => result => {
  const popularity = (result.uri != null) ? popularityByUri[result.uri] : 0
  result.popularityScore = popularity
  result.globalScore = boostScore(result.lexicalScore, popularity)
  return result
}

const logFactor = 2
// Inspired by https://www.elastic.co/guide/en/elasticsearch/guide/current/boosting-by-popularity.html
const boostScore = (lexicalScore, popularity) => {
  const globalScore = lexicalScore * Math.log(1 + (logFactor * popularity))
  return _.round(globalScore, 2)
}
