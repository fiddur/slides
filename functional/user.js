const bcrypt = require('bcrypt')
const getDb  = require('./getDb')
const uuid   = require('node-uuid')

const SALT_ROUNDS = 10

function User(userData) {
  this.id     = userData.id
  this.name   = userData.name
  this.pwHash = userData.pwHash
}

User.create = async function create({ name, password }) {
  const db = await getDb()
  const id = uuid.v4()

  const user = new User({ id, name })
  await db.collection('users').insertOne({ id, name })
  await user.setPassword(password)
  return user
}

User.getById = async function getById(id) {
  const db = await getDb()
  const userData = await db.collection('users').findOne({ id })
  return new User(userData)
}

User.prototype.setPassword = async function setPassword(password) {
  this.pwHash = await bcrypt.hash(password, SALT_ROUNDS)
  const db = await getDb()
  await db.collection('users').findOneAndUpdate(
    { id: this.id },
    { $set: { pwHash: this.pwHash } }
  )
}

User.prototype.login = async function login(password) {
  if (await bcrypt.compare(password, this.pwHash)) {
    this.authenticated = true
  } else {
    throw new Error('Bad password')
  }
}

module.exports = User
