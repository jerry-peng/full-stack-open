const TestDB = require('./test_db')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

beforeAll(() => testDB.start())

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

afterAll(() => testDB.stop())

test('blogs are returned as json', async () => {
  await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
})
