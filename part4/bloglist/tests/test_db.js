const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000)

const COLLECTIONS = []

class TestDB {
  constructor() {
    this.db = new MongoMemoryServer()
  }
  
  async start() {
    const url = await this.db.getConnectionString() 
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  stop() {
    mongoose.disconnect()
    this.db.stop()
  }

  async populate(objects) {
    await Promise.all(objects.map(o => o.save()))
  }

  async cleanup(...collections) {
    await Promise.all(collections.map(c => c.deleteMany({})))
  }
}

module.exports = TestDB
