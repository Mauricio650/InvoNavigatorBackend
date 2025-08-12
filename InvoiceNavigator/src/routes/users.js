import { Router } from 'express'
import { ControllerUser } from '../controllers/users.js'

export const createUserRouter = ({ modelUser }) => {
  const userRouter = Router()
  const userController = new ControllerUser({ modelUser })

  userRouter.post('/register', userController.register)
  userRouter.post('/login', userController.login)
  userRouter.post('/logout', userController.logout)
  userRouter.post('/verifyToken', userController.verifyToken)
  userRouter.post('/changePassword', userController.changePassword)

  return userRouter
}
