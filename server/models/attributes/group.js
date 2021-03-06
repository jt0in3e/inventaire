module.exports = {
  // Attributes that can be changed by an admin with a simple validity check
  updatable: [
    'name',
    'picture',
    'description',
    'searchable',
    'position'
  ],

  usersLists: [
    'admins',
    'members',
    'invited',
    'declined',
    'requested'
  ]
}
