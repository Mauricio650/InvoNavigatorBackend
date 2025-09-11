import express from 'express'
import { createUserRouter } from '../routes/users.js'
import { createInvoiceRouter } from '../routes/invoices.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { corsOptions } from '../cors/cors.js'
import dotenv from 'dotenv'

dotenv.config()

export const createApp = ({ modelUser, modelInvoice }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(cookieParser())

  app.get('/test', (req, res) => res.status(200).json({ message: 'all ok' }))

  app.use('/', createUserRouter({ modelUser }))

  app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }

    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.session.user = data
    } catch (error) {
      const refreshToken = req.cookies.refresh_token
      if (!refreshToken) {
        return res.status(401).json({ error: 'access not authorized' })
      }
      try {
        const data = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
        const token = jwt.sign({ id: data.id, username: data.username, role: data.role }, process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' })
        res.cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true
        })
        req.session.user = data
      } catch (error) {
        return res.status(401).json({ error: 'access not authorized' })
      }
    }

    next()
  })

  app.use('/', createInvoiceRouter({ modelInvoice }))

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`)
  })
  return app
}
