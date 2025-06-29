import mongoose from 'mongoose'

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 10,
    validate: {
      validator: function (v) {
        const regex = /^(?=.*[A-Z])(?=.*\d).+$/
        return regex.test(v)
      },
      message: 'must contain at least a number and a uppercase'
    }
  },
  password: {
    type: String,
    required: true,
    maxlength: 60,
    validate: {
      validator: function (v) {
        return v.length === 60
      },
      message: 'the password must to have 60 chars'
    }
  },
  fullName: {
    type: String,
    required: true,
    maxlength: 55
  },
  role: {
    type: String,
    default: 'user'
  }
}, { strict: true })

export const User = mongoose.model('User', schemaUser)
