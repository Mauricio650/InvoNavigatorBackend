import jwt from 'jsonwebtoken'
import { validateSchemaUser, validatePartialUser } from '../schemas/users.js'
import dotenv from 'dotenv'

dotenv.config()
const jwtSecretKey = process.env.JWT_SECRET_KEY

export class ControllerUser {
  constructor ({ modelUser }) {
    this.modelUser = modelUser
  }

  register = async (req, res) => {
    const result = validateSchemaUser(req.body)

    if (!result.success) {
      const errors = { error: true }
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(400).json(errors)
    }

    try {
      const NewUser = await this.modelUser.register({ input: result.data })
      return res.status(201).json({ UserCreated: NewUser, ok: true })
    } catch (error) {
      if (error.message === 'username already exists') return res.status(404).json({ error: error.message })
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  login = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (!result.success) {
      const errors = { error: true }
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(400).json(errors)
    }

    try {
      const user = await this.modelUser.login({ input: result.data })
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, jwtSecretKey,
        { expiresIn: '15m' })

      const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, jwtSecretKey,
        { expiresIn: '7d' })

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      })

      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict'
      })

      res.status(200).json({ ok: true, user: { user, token } })
    } catch (error) {
      if (error.message === 'User not exists' ||
        error.message === 'User or password is wrong') {
        return res.status(404)
          .json({ error: 'User or password is wrong' })
      }
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  logout = async (req, res) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.status(200).json({ logout: 'successful' })
  }

  verifyToken = async (req, res) => {
    const token = req.body.token
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
      return res.status(200).json({ TokenIsValid: true, user: data })
    } catch (error) {
      return res.status(401).json({ TokenIsValid: false })
    }
  }
}
