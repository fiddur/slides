const bcrypt = require('bcrypt')

const loginUser = async (user, password) => {
  if (await bcrypt.compare(password, user.pwHash)) {
    user.authenticated = true
  } else {
    throw new Error('Bad password')
  }
}

async function main() {
  const user = {
    pwHash: await bcrypt.hash('fubar', 10),
  }

  await loginUser(user, 'fubar')

  console.log(user)
}

main()
