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
      throw new Error('password is wrong')
    }
    const { _id, username, role, fullName } = verifyUsername
    return { _id, username, role, fullName }
  }

  static async changePassword ({ username, passwords }) {
    const verifyUsername = await User.findOne({ username })
    if (!verifyUsername) {
      throw new Error('User not exists')
    }
    const resultPassword = bcrypt.compareSync(passwords.passwordOLD, verifyUsername.password)
    if (!resultPassword) {
      throw new Error('password is wrong')
    }
    const { _id } = verifyUsername
    const hashedPassword = await bcrypt.hash(passwords.passwordNEW, 10)
    const updatePassword = await User.findByIdAndUpdate(_id, { $set: { password: hashedPassword } }, { new: true, runValidators: true })
    return { successfully: true }
  }
}
