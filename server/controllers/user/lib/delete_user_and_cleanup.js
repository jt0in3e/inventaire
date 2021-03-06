const __ = require('config').universalPath
const relations_ = __.require('controllers', 'relations/lib/queries')
const deleteUserItems = __.require('controllers', 'items/lib/delete_user_items')
const { leaveAllGroups } = __.require('controllers', 'groups/lib/leave_groups')
const { cancelAllActiveTransactions } = __.require('controllers', 'transactions/lib/transactions')
const notifs_ = __.require('lib', 'notifications')
const { softDeleteById } = __.require('controllers', 'user/lib/delete')

module.exports = async userId => {
  const res = await softDeleteById(userId)
  await Promise.all([
    relations_.deleteUserRelations(userId),
    leaveAllGroups(userId),
    cancelAllActiveTransactions(userId),
    notifs_.deleteAllByUserId(userId)
  ])
  // Should be run after cancelling transactions, as transaction updates
  // might try to update items busyness state
  await deleteUserItems(userId)
  return res
}
