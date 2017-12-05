const { Map, List, fromJS } = require('immutable')
const bcrypt = require('bcrypt')
const uuid   = require('node-uuid')

const SALT_ROUNDS = 10

const setPassword = db => user => async password => {
  const pwHash = await bcrypt.hash(password, SALT_ROUNDS)
  await db.collection('users').findOneAndUpdate(
    { id: user.get('id') },
    { $set: { pwHash } }
  )
  return user.set('pwHash', pwHash)
}

const login = db => user => async password => {
  if (await bcrypt.compare(password, user.get('pwHash'))) {
    return user.set('authenticated', true)
  }

  throw new Error('Bad password')
}

const create = db => async ({ name, password }) => {
  const id = uuid.v4()
  const user = new Map({ id, name })
  await db.collection('users').insertOne({ id, name })
  return setPassword(db)(user)(password)
}

const getById = db => async id => {
  const userData = await db.collection('users').findOne({ id })
  return fromJS(userData)
}

const User = db => ({
  create:      create(db),
  getById:     getById(db),
  setPassword: setPassword(db),
  login:       login(db),
})

module.exports = db => User(db)
