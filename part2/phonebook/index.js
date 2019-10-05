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

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  const now = new Date()
  text = `<p>Phonebook has info for ${persons.length} people</p>`
  text += `<p>${now.toString()}</p>`
  res.send(text)
})

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  // if (persons.map(v => v.name).includes(body.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
    persons = persons.concat(savedPerson)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(v => v.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
