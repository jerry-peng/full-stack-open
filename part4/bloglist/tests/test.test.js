const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)
const db = new MongoMemoryServer()

beforeAll(async () => {
  const uri = await db.getConnectionString()
  console.log(uri)
  await mongoose.connect(uri)
})

beforeEach(async () => {
  const blog = new Blog({
      title: 'Author blog 1',
      author: 'Author Name',
      url: 'author.com',
      likes: 0
    })
  await blog.save()
})

afterEach(() => Blog.remove());

afterAll(async () => {
  mongoose.disconnect()
  db.stop()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})
