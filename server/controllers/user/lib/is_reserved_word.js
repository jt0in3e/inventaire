// Additionnaly all 1 letter strings are reserved words
// but the restriction is handled by the username regex
const reservedWords = [
  'api',
  'auth',
  'contact',
  'contacts',
  'contribute',
  'donate',
  'ean',
  'email',
  'entities',
  'entity',
  'exchange',
  'exchanges',
  'feedback',
  'friend',
  'friends',
  'give',
  'group',
  'groups',
  'inv',
  'inventories',
  'inventorize',
  'inventory',
  'isbn',
  'item',
  'items',
  'last',
  'lend',
  'listings',
  'map',
  'me',
  'nearby',
  'network',
  'private',
  'profil',
  'profile',
  'public',
  'sell',
  'setting',
  'settings',
  'share',
  'transaction',
  'transactions',
  'user',
  'username',
  'users',
  'wd',
  'welcome',
  'wikidata'
]

// TODO: refactor to a hash lookup instead of looping
module.exports = username => reservedWords.includes(username)
