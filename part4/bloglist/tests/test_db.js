const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

// Extend the default timeout so MongoDB binaries can download

// List your collection names here
const COLLECTIONS = []

class TestDB {
  constructor() {
    this.db = new MongoMemoryServer()
    this.connection = null
  }
  
  async start() {
    const url = await this.db.getConnectionString() 
    this.connection = await mongoose.connect(url, {
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
