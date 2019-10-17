const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First Blog', 
    author: 'Author 1',
    url: 'author1.com',
    likes: 3
  },
  {
    title: 'Second Blog', 
    author: 'Author 2',
    url: 'author2.com',
    likes: '0'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Non Existing Blog', 
    author: 'Non Existent Author',
    url: 'nonexistingauthor.com',
    likes: '100'
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
