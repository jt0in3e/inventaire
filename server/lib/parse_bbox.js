// this module is doomed to be replaced by a geobox parser
// to fit search_by_positions needs: keeping it as a placeholder
const __ = require('config').universalPath
const _ = __.require('builders', 'utils')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error/error')
const assert_ = __.require('utils', 'assert_types')

const parseLatLng = query => {
  let { bbox } = query

  if (bbox == null) return error_.rejectMissingQuery('bbox')

  try {
    bbox = JSON.parse(bbox)
    assert_.numbers(bbox)
  } catch (err) {
    return error_.rejectInvalid('bbox', bbox)
  }

  let [ minLng, minLat, maxLng, maxLat ] = bbox
  _.log(bbox, 'minLng, minLat, maxLng, maxLat')

  if (minLng >= maxLng || minLat >= maxLat) {
    return error_.rejectInvalid('bbox coordinates', bbox)
  }

  // not throwing an error when a coordinate is over its limit
  // but replacing it by the limit to make following calculations lighter
  if (minLng < -180) minLng = -180
  if (maxLng > 180) maxLng = 180
  if (minLat < -90) minLat = -90
  if (maxLng > 90) maxLng = 90

  return [ minLng, minLat, maxLng, maxLat ]
}

module.exports = query => promises_.try(parseLatLng.bind(null, query))