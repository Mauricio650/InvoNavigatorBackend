import mongoose from 'mongoose'

const schemaInvoices = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    maxlength: 280
  },
  to: {
    type: String,
    required: true,
    maxlength: 10
  },
  number: {
    type: String,
    required: true,
    maxlength: 100
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId, // id gridFS
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  message: {
    type: String,
    default: 'empty'
  },
  uploadAt: {
    type: Date,
    default: Date.now
  }
}, { strict: true })

export const Invoice = mongoose.model('InvoiceData', schemaInvoices)
