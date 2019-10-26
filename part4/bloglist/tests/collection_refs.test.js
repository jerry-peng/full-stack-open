const TestDB = require('./test_db')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

beforeAll(() => testDB.start())

afterAll(() => testDB.stop())

describe('when there are some users saved', () => {
  beforeEach(async () => {
    const users = helper.initialUsers
    await Promise.all(users.map(user => api.post('/api/users').send(user)))
  })

  afterEach(() => testDB.cleanup(Blog, User))

  test.only('added blog references user', async () => {
    const loginResponse = await api.post('/api/login').send({
      username: 'johndoe',
      password: 'password'
    })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'newauthor.com',
      likes: '10'
    }

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = await Blog.findById(response.body.id)

    expect(blog.user).toBeDefined()

    const user = await User.findById(blog.user)

    expect(user.blogs.map(blog => blog.toString())).toContain(blog._id.toString())
  })
})
