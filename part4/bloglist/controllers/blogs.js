const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  await response.json(blogs)  
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  try {
    const savedBlog = await blog.save()
    await response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception) 
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    await response.status(204).end()
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
