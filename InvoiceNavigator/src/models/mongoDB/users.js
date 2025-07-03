import { User } from './schemaUser.js'

import bcrypt from 'bcrypt'

export class ModelUser {
  static async register ({ input }) {
    const { fullName, username, password } = input
    const verifyName = await User.findOne({ username })

    if (verifyName) {
      throw new Error('username already exists')
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await User.create({ username, password: hashedPassword, fullName })
      return newUser.fullName
    } catch (error) {
      throw new Error('internal server error')
    }
  }

  static async login ({ input }) {
    const verifyUsername = await User.findOne({ username: input.username })
    if (!verifyUsername) {
      throw new Error('User not exists')
    }
    const resultPassword = bcrypt.compareSync(input.password, verifyUsername.password)
    if (!resultPassword) {
      throw new Error('User or password is wrong')
    }
    const { _id, username, role, fullName } = verifyUsername
    return { _id, username, role, fullName }
  }
}
