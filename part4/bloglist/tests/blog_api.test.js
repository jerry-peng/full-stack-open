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

describe('when there are some blogs saved', () => {
  beforeEach(async () => {
    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    await testDB.populate(blogs)
  })

  afterEach(() => testDB.cleanup(Blog))

  describe('fetching blogs', () => {
    test('are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('are returned with correct number of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('are returned with correct titles', async () => {
      const response = await api.get('/api/blogs') 
      expect(response.body.map(blog => blog.title))
        .toEqual(expect.arrayContaining(helper.initialBlogs.map(blog => blog.title)))
    })

    test('are returned with id property', async () => {
      const response = await api.get('/api/blogs')
      await Promise.all(response.body.map(blog => expect(blog.id).toBeDefined()))
    })
  })

  describe('adding a new blog', () => {
    test('succeeds with valid data', async () => {
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

      expect(blogs.length).toBe(helper.initialBlogs.length + 1)
      expect(addedBlog).toHaveProperty('title', 'New Blog')
      expect(addedBlog).toHaveProperty('author', 'New Author')
      expect(addedBlog).toHaveProperty('url', 'newauthor.com')
      expect(addedBlog).toHaveProperty('likes', 10)
    })

    test('succeeds with a blog with missing `likes` property, `likes` default to 0', async () => {
      const newBlogMissingLikes = {
        title: 'New blog missing likes property',
        author: 'New Author',
        url: 'newauthor.com'
      }

      await api.post('/api/blogs')
        .send(newBlogMissingLikes)
        .expect(201)

      const blogs = await helper.blogsInDb()
      const addedBlog = blogs.find(b => b.title === 'New blog missing likes property')
      expect(blogs.length).toBe(helper.initialBlogs.length + 1)
      expect(addedBlog).toHaveProperty('likes', 0)
    })

    test('succeeds with a blog with empty `likes` property, `likes` default to 0', async () => {
      const newBlogMissingLikes = {
        title: 'New blog missing likes property',
        author: 'New Author',
        url: 'newauthor.com',
        likes: ''
      }

      await api.post('/api/blogs')
        .send(newBlogMissingLikes)
        .expect(201)

      const blogs = await helper.blogsInDb()
      const addedBlog = blogs.find(b => b.title === 'New blog missing likes property')
      expect(blogs.length).toBe(helper.initialBlogs.length + 1)
      expect(addedBlog).toHaveProperty('likes', 0)
    })

    test('fails with status code 400 if `title` is missing', async() => {
      const newBlogMissingTitle = {
        author: 'New Author',
        url: 'newauthor.com',
        likes: '10'
      }

      await api.post('/api/blogs')
        .send(newBlogMissingTitle)
        .expect(400)

      const blogs = await helper.blogsInDb()
      expect(blogs.length).toBe(helper.initialBlogs.length)
    })

    test('fails with status code 400 if `url` is missing', async() => {
      const newBlogMissingAuthor = {
        title: 'New blog',
        author: 'New Author',
        likes: '10'
      }

      await api.post('/api/blogs')
        .send(newBlogMissingAuthor)
        .expect(400)

      const blogs = await helper.blogsInDb()
      expect(blogs.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if `id` is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.content)
      expect(titles).not.toContain(blogToDelete.title)
    }) 

    test('succeeds with status code 204 if `id` does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()
      await api.delete(`/api/blogs/${nonExistingId}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('fails with status code 400 if `id` is invalid', async () => {
      let nonExistingId = await helper.nonExistingId()
      const invalidId = nonExistingId.slice(1, nonExistingId.length)
      await api.delete(`/api/blogs/${invalidId}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdateId = blogsAtStart[0].id

      const updatedValidBlog = {
        title: 'Updated Blog',
        author: 'Updated Author',
        url: 'updatedauthor.com',
        likes: 100
      }

      await api.put(`/api/blogs/${blogToUpdateId}`)
        .send(updatedValidBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtStart.length)

      const blogUpdated = blogsAtEnd.find(blog => blog.title === 'Updated Blog')
      expect(blogUpdated).toHaveProperty('author', 'Updated Author')
      expect(blogUpdated).toHaveProperty('url', 'updatedauthor.com')
      expect(blogUpdated).toHaveProperty('likes', 100)
    }) 

    test('fails with status code 400 if `title` is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdateId = blogsAtStart[0].id

      const blogUpdatedMissingTitle = {
        author: 'Updated Author',
        url: 'updatedauthor.com',
        likes: 100
      }

      await api.put(`/api/blogs/${blogToUpdateId}`)
        .send(blogUpdatedMissingTitle)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toEqual(blogsAtEnd)
    })

    test('fails with status code 400 if `url` is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdateId = blogsAtStart[0].id

      const blogUpdatedMissingUrl = {
        title: 'Updated Blog',
        author: 'Updated Author',
        likes: 100
      }

      await api.put(`/api/blogs/${blogToUpdateId}`)
        .send(blogUpdatedMissingUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toEqual(blogsAtEnd)
    })

    test('fails with status code 400 if `id` does not exist', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const nonExistingId = helper.nonExistingId()

      const updatedValidBlog = {
        title: 'Updated Blog',
        author: 'Updated Author',
        url: 'updatedauthor.com',
        likes: 100
      }

      await api.put(`/api/blogs/${nonExistingId}`)
        .send(updatedValidBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toEqual(blogsAtEnd)
    })

    test('fails with status code 400 if `id` is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      let nonExistingId = await helper.nonExistingId()
      const invalidId = nonExistingId.slice(1, nonExistingId.length)

      const updatedValidBlog = {
        title: 'Updated Blog',
        author: 'Updated Author',
        url: 'updatedauthor.com',
        likes: 100
      }

      await api.put(`/api/blogs/${invalidId}`)
        .send(updatedValidBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toEqual(blogsAtEnd)
    })
  })
})

describe.only('when there is initially two users at db', () => {
  beforeEach(async () => {
    const users = helper.initialUsers.map(user => new User(user))
    await testDB.populate(users)
  })

  afterEach(() => testDB.cleanup(User))

  describe('fetching users', () => {
    test('returns json with status 200', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('returns with correct number of users', async () => {
      const usersAtStart = await helper.usersInDb()
      const response = await api.get('/api/users')
      expect(response.body.length).toBe(usersAtStart.length)
    })
    test('returns with correct usernames', async () => {
      const response = await api.get('/api/users')
      expect(response.body.map(user => user.username))
        .toEqual(expect.arrayContaining(helper.initialUsers.map(user => user.username)))
    })
    test('returns without password hash', async () => {
      const response = await api.get('/api/users')
      Promise.all(response.body.map(user => expect(user.passwordHash).toBeUndefined()))
    })
  })

  describe('adding new users', () => {
    test('succeeds with status code 201 if data is valid', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'einstein',
        name: 'Albert Einstein',
        password: 'secret password'
      }
      const response = await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
      expect(response.body.username).toBe('einstein')
      expect(response.body.name).toBe('Albert Einstein')
      expect(response.body.passwordHash).toBeUndefined() 
    })
    
    test('succeeds with status code 201 if both username and password are length 3', async () => {
      const usersAtStart = await helper.usersInDb() 
      const newUser = {
        username: 'alb',
        name: 'Albert Einstein',
        password: 'pwd'
      }
      const response = await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
      expect(response.body.username).toBe('alb')
      expect(response.body.name).toBe('Albert Einstein')
      expect(response.body.passwordHash).toBeUndefined() 
    })

    test('fails with status code 400 if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        name: 'Albert Einstein',
        password: 'secret password'
      }

      const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with status code 400 if username is length 2', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'al',
        name: 'Albert Einstein',
        password: 'secret password'
      }

      const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with status code 400 if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'einstein',
        name: 'Albert Einstein',
      }

      const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with status code 400 if password is length 2', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'einstein',
        name: 'Albert Einstein',
        password: 'pw'
      }

      const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with status code 400 if username already exists', async () => {
      const usersAtStart = await helper.usersInDb() 
      const newUser = {
        username: 'root',
        name: 'Albert Einstein',
        password: 'new password'
      }

      const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})
