import supertest from 'supertest'
import { app } from '../../app'

const api = supertest(app)

let jwt
const usernameForRegisterTest = 'TestP31'

beforeAll(async () => {
  const response = await api.post('/login')
    .send({ username: 'Mau31', password: 'Uvabombom31' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  jwt = response.headers['set-cookie']
})

describe('functions users test:', () => {
  test('register', async () => {
    await api.post('/register')
      .send({
        username: usernameForRegisterTest,
        password: 'Testestin31',
        fullName: 'test testting test'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Invoices tests:', () => {
  test('get invoices', async () => {
    await api.get('/home/invoices')
      .set('Cookie', jwt)
      .expect(200)
  })
})

afterAll(async () => {
  await api.delete('/deleteUser')
    .send({ username: usernameForRegisterTest })
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
