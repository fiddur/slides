const MongoClient = require('mongodb').MongoClient

async function getDb() {
  const url = 'mongodb://localhost:27017/myproject'
  return MongoClient.connect(url)
}

module.exports = getDb
