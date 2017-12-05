const getDb      = require('./getDb')
const UserModule = require('./user2')

async function main() {
  const db = await getDb()
  const User = UserModule(db)

  const user1 = await User.create({
    name:     'fiddur',
    password: 'fubar',
  })
  console.log(user1.toJS())

  const user = await User.getById(user1.get('id'))
  console.log(user.toJS())

  const user2 = await User.login(user)('fubar')
  console.log('Logged in', { user: user.toJS(), user2: user2.toJS() })
}

main()
