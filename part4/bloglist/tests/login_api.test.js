const TestDB = require('./test_db')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)
const testDB = new TestDB()

require('dotenv').config()

beforeAll(() => testDB.start())

afterAll(() => testDB.stop())

describe('When there is a user in database', () => {
  beforeEach(async () => {
    const user = helper.initialUsers[1]
    await api.post('/api/users').send(user)
  })

  afterEach(async () => testDB.cleanup(User))


  test('login succeeds if username and password is correct', async () => {
    const response = await api.post('/api/login').send({
      username: 'johndoe',
      password: 'password'
    })
    
    const body = response.body
    console.log(body.username)

    expect(body.token).toBeDefined()
    expect(body.username).toBe('johndoe')
    expect(body.name).toBe('John Doe')
  })

  test('login succeeds if username and password is correct', async () => {
    const response = await api.post('/api/login').send({
      username: 'johnd',
      password: 'password'
    })
    
    const body = response.body
    const error = { error: 'invalid username or password' }

    expect(body).toEqual(error)
  })

  test('login succeeds if username and password is correct', async () => {
    const response = await api.post('/api/login').send({
      username: 'johndoe',
      password: 'pass'
    })
    
    const body = response.body
    const error = { error: 'invalid username or password' }

    expect(body).toEqual(error)
  })
})
