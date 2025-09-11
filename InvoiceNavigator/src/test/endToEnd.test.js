import supertest from 'supertest'
import { app } from '../../app'

const api = supertest(app)

let jwt
let tokenForRouteVerifyToken
const usernameForRegisterTest = 'TestP31'

beforeAll(async () => {
  const response = await api.post('/login')
    .send({ username: 'Mau31', password: 'Uvabombom31' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  tokenForRouteVerifyToken = response.body.user.token
  jwt = response.headers['set-cookie']
})

describe('functions users test:', () => {
  test('Route register', async () => {
    await api.post('/register')
      .send({
        username: usernameForRegisterTest,
        password: 'Testestin31',
        fullName: 'test testing test'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('Route VerifyTokens', async () => {
    await api.post('/verifyToken')
      .send({ token: tokenForRouteVerifyToken })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Route ChangePassword', async () => {
    await api.post('/changePassword')
      .set('Cookie', jwt)
      .send({ passwordOLD: 'Uvabombom31', passwordNEW: 'Uvabombom31' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Invoices tests:', () => {
  test('Route get invoices', async () => {
    await api.get('/home/invoices')
      .set('Cookie', jwt)
      .expect(200)
  })
})

afterAll(async () => {
  await api.post('/logout')
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api.delete('/deleteUser')
    .send({ username: usernameForRegisterTest })
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
