const TestDB = require('./test_db')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const testServer = new TestDB()
const api = supertest(app)

beforeAll(() => TestDB.start())
afterAll(() => TestDB.stop())
beforeEach(async () => {
  const blog = new Blog({
    title: 'Title',
    author: 'Author Name',
    url: 'MyUrl.com',
    likes: 0
  })
  await blog.save()
})
afterEach(() => TestDB.cleanup())

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
