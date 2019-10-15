const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000)

class TestDB {
  constructor() {
    this.db = new MongoMemoryServer()
  }
  
  async start() {
    const url = await this.db.getConnectionString() 
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  stop() {
    mongoose.disconnect()
    this.db.stop()
  }

  reset() {
    cleanup() 
  }

  cleanup() {
    return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({}))) 
  }
}

module.exports = TestDB
