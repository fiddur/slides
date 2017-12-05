const util = require('util')
const http = require('http')

function Tautologer(epoch) {
  return {
    statement: cb => cb(null, `I was created at ${epoch}\n`),
  }
}

let counter = 0
const server = http.createServer(async (req, res) => {
  const myTaut = new Tautologer(Date.now())
  const statementAsync = util.promisify(myTaut.statement.bind(myTaut))

  process.stdout.write(`Answering request ${counter++}\n`)

  res.end(await statementAsync())
})

server.listen(3000, err => {
  if (err) console.error(err) && process.exit(1)
})
