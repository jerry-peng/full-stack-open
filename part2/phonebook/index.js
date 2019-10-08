const express = require('express')
const app = express()
app.use(express.static('build'))

const morgan = require('morgan')
const morganConfig = (tokens, req, res) => {
  const config = []
  config.push(tokens.method(req, res))
  config.push(tokens.url(req, res))
  config.push(tokens.status(req, res))
  config.push(tokens.status(req, res))
  config.push(tokens.res(req, res, 'content-length'))
  config.push('-')
  config.push(tokens['response-time'](req, res))
  config.push('ms')
  if (req.method == 'POST') {
    config.push(JSON.stringify(req.body)) 
  }
  return config.join(' ')
}
app.use(morgan(morganConfig))

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Person = require('./models/person')

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const now = new Date()
    text = `<p>Phonebook has info for ${persons.length} people</p>`
    text += `<p>${now.toString()}</p>`
    res.send(text)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  console.log(body.name, body.number)
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end() 
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON()) 
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end() 
    })
    .catch(error => next(error))
})

const unknownEndpoint = (res, req) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id'}) 
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
