const User = require('./user')

async function main() {
  const user1 = await User.create({
    name:     'fiddur',
    password: 'fubar',
  })

  const user = await User.getById(user1.id)
  console.log(user)

  await user.login('fubar')
  console.log('Logged in', user)
}

main()
