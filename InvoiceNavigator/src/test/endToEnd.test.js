import supertest from 'supertest'
import { app } from '../../app'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const api = supertest(app)

/* These are some variables needed for the tests */
let jwt /* access token and refresh token for protected routes */
let tokenForRouteVerifyToken /* string access_token for verify token route  */
const usernameForRegisterTest = 'TestP31' /* new user for register route */
let idInvoiceCreated /* new invoices's id, is needed because we need delete the invoice created in test */
let fileIdInvoiceCreated

beforeAll(async () => {
  /* We need to login for protected routes */
  const response = await api.post('/login')
    .send({ username: process.env.USER_TEST, password: process.env.PASSWORD_TEST })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  tokenForRouteVerifyToken = response.body.user.token /* save string token for verifyToken route */
  jwt = response.headers['set-cookie'] /* save jwt token */
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

  test('Route Upload Invoice', async () => {
    const pdfPath = path.join(__dirname, 'fixtures', 'test.pdf')
    const response = await api.post('/upload')
      .set('Cookie', jwt)
      .attach('myfile', pdfPath)
      .field('company', 'test sas')
      .field('to', 'User4')
      .field('number', 'tes000015')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    idInvoiceCreated = response.body.Inserted._id
    fileIdInvoiceCreated = response.body.Inserted.fileId
  })

  test('Route Filter Invoices', async () => {
    await api.post('/home/filterInvoices')
      .set('Cookie', jwt)
      .send({ from: '2026-12-01' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Route Download invoice', async () => {
    await api.get(`/home/download/${fileIdInvoiceCreated}`)
      .set('Cookie', jwt)
      .expect('Content-Type', /application\/pdf/)
  })

  test('Route Update invoice', async () => {
    const pdfPath = path.join(__dirname, 'fixtures', 'test.pdf')
    await api.patch(`/home/invoices/update/${idInvoiceCreated}`)
      .set('Cookie', jwt)
      .attach('myfile', pdfPath) // adjunta archivo
      .field('company', 'hola555')
      .field('fileId', fileIdInvoiceCreated)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Route update status invoices', async () => {
    await api.patch(`/home/updateStatus/${idInvoiceCreated}`)
      .set('Cookie', jwt)
      .send({ action: 'reject' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Route updateMessage', async () => {
    await api.patch(`/home/updateMessage/${idInvoiceCreated}`)
      .set('Cookie', jwt)
      .send({ message: 'Test message' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await api.delete(`/home/invoices/delete/${idInvoiceCreated}`)
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api.delete('/deleteUser') /* Delete the user that created in test */
    .send({ username: usernameForRegisterTest })
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api.post('/logout') /* logout session */
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
