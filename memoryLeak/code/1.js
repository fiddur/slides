const bluebird = require('bluebird')
const http = require('http')

function Tautologer(epoch) {
  return {
    statement: cb => cb(null, `I was created at ${epoch}\n`),
  }
}

let counter = 0
const server = http.createServer(async (req, res) => {
  const myTaut = new Tautologer(Date.now())
  bluebird.promisifyAll(myTaut)

  console.log(`Answering request ${counter++}`)

  res.end(await myTaut.statementAsync())
})

server.listen(3000, err => {
  if (err) console.error(err) && process.exit(1)
})
