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
    const users = helper.initialUsers.map(user => new User(user))
    await testDB.populate(users)
  })

  afterEach(() => testDB.cleanup(Blog, User))

  test('added blog references user', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'newauthor.com',
      likes: '10'
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(b => b.title === 'New Blog')

    expect(addedBlog.user).toBeDefined()

    const user = helper.initialUsers[0]
    const refUser = addedBlog.user
    expect(refUser.username).toBe(user.username)
    expect(refUser.name).toBe(user.name)
    expect(refUser.blogs).toBeUndefined()
  })

  test('user references added blog', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'newauthor.com',
      likes: '10'
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const addedBlog = blogs.find(b => b.title === 'New Blog')

    const response = await api.get('/api/users')
    const users = response.body
    const user = users.find(u => u.id === addedBlog.user.toString())

    expect(user.blogs.length).toBe(1)

    const refBlog = user.blogs[0]
    expect(refBlog.title).toBe('New Blog')
    expect(refBlog.author).toBe('New Author')
    expect(refBlog.url).toBe('newauthor.com')
    expect(refBlog.likes).toBe(10)
    expect(refBlog.blogs).toBeUndefined()
  })
})
