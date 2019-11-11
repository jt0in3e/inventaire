// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const userDoc = (username, idLastCharacters) => ({
  _id: `00000000000000000000000000000${idLastCharacters}`,
  username,
  special: true,

  // Data required to avoid crashing users logic
  snapshot:  {}
})

module.exports = {
  users: {
    // A fake user used to sign entities edit generated from dataseed
    // see server/data/dataseed/dataseed.js
    seed: userDoc('seed', '000'),
    // see server/controllers/entities/lib/update_claims_hooks
    hook: userDoc('hook', '001'),
    reconciler: userDoc('reconciler', '002'),
    // used by scripts/update_entities_schema
    updater: userDoc('updater', '003')
  }
}
