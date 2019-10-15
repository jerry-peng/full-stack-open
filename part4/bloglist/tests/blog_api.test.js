const TestDB = require('./test_db')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

beforeAll(() => testDB.start())

beforeEach(async () => {
  blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  testDB.populate(blogObjects)
})

afterEach(() => testDB.cleanup(Blog))

afterAll(() => testDB.stop())

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length)
})
