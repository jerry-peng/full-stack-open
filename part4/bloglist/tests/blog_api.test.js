const TestDB = require('./test_db')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

beforeAll(() => testDB.start())

beforeEach(async () => {
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  await testDB.populate(blogObjects)
})

afterEach(() => testDB.cleanup(Blog))

afterAll(() => testDB.stop())

describe('when there are some blogs saved', () => {
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

    test('succeeds with a blog with missing likes property, likes default to 0', async () => {
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

    test('succeeds with a blog with empty likes property, likes default to 0', async () => {
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

      const response = await api.post('/api/blogs')
        .send(newBlogMissingTitle)
        .expect(400)

      const blogs = await helper.blogsInDb()
      expect(blogs.length).toBe(helper.initialBlogs.length)
      expect(response.body).toHaveProperty('error', 'Blog validation failed: title: Path `title` is required.')
    })

    test('fails with status code 400 if `url` is missing', async() => {
      const newBlogMissingAuthor = {
        title: 'New blog',
        author: 'New Author',
        likes: '10'
      }

      const response = await api.post('/api/blogs')
        .send(newBlogMissingAuthor)
        .expect(400)

      const blogs = await helper.blogsInDb()
      expect(blogs.length).toBe(helper.initialBlogs.length)
      expect(response.body).toHaveProperty('error', 'Blog validation failed: url: Path `url` is required.')
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
  })
})
