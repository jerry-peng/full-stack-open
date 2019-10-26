const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)  
})

blogsRouter.post('/', async (request, response, next) => {

  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' }) 
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception) 
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' }) 
    }

    const blog = await Blog.findById(request.params.id)

    if (decodedToken.id !== blog.user.toString()) {
      response.status(401).json({ error: 'Unauthorized to delete' }).end()
    }

    const user = await User.findById(decodedToken.id)
    user.blogs = user.blogs.filter(_id => _id.toString() !== request.params.id)
    await user.save()

    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    next(exception) 
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  try {
    const blogUpdated = await Blog
      .findByIdAndUpdate(request.params.id, blog, {
        new: true,
        runValidators: true
      })
    response.json(blogUpdated.toJSON())
  } catch (exception) {
    next(exception) 
  }
})

module.exports = blogsRouter
