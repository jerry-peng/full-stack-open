const TestDB = require('./test_db')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

beforeAll(() => testDB.start())

afterAll(() => testDB.stop())

describe('when there is initially two users at db', () => {
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

      const error = {
        error: 'password missing' 
      }

      expect(response.body).toEqual(error)
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

      const error = {
        error: 'password should be at least 3 characters long' 
      }

      expect(response.body).toEqual(error)
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
