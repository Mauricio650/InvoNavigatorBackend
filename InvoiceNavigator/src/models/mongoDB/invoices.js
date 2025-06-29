import { Invoice } from './schemaInvoice.js'
import { deleteFile, downloadFile } from '../../config/db.js'

export class InvoiceModel {
  static async newInvoice ({ data, fileId }) {
    const { to, company, number } = data

    try {
      const check = await Invoice.findOne({ number, company })
      if (check) {
        throw new Error('Error creating invoice: Invoices already in used')
      }
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`)
    }

    try {
      const result = await Invoice.create({ to, company, number, fileId })
      return result
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`)
    }
  }

  // User Mood ==>
  static async getInvoices ({ username, from, end }) {
    try {
      const invoices = await Invoice.find({
        to: username,
        uploadAt: { $gte: from.toJSDate(), $lte: end.toJSDate() }
      })

      return invoices
    } catch (error) {
      throw new Error('Server error getting invoices', error)
    }
  }

  // Admin Mood ==>
  static async getAllInvoices ({ from, end }) {
    try {
      const invoices = await Invoice.find({ uploadAt: { $gte: from.toJSDate(), $lte: end.toJSDate() } })

      return invoices
    } catch (error) {
      throw new Error('Server error getting invoices', error)
    }
  }

  static async updateInvoice ({ data, id, fileId = false }) {
    if (fileId) {
      try {
        await deleteFile({ fileId: data.fileId })
        data.fileId = fileId
      } catch (error) {
        throw new Error('error updating invoice')
      }
    }
    try {
      const result = await Invoice.findByIdAndUpdate(id, data, {
        new: true, // return update document
        runValidators: true // run validators before update
      })
      return result
    } catch (error) {
      throw new Error('Error updating invoice', error)
    }
  }

  static async validatedUpdateId ({ id }) {
    try {
      const invoice = await Invoice.findOne({ _id: id })
      return invoice
    } catch (error) {
      throw new Error('Error validating ID invoice')
    }
  }

  static async deleteInvoice ({ id }) {
    try {
      const result = await Invoice.findOne({ _id: id })
      const { fileId } = result
      await deleteFile({ fileId })
    } catch (error) {
      throw new Error('ID not found', error)
    }
    try {
      const result = await Invoice.findByIdAndDelete({ _id: id })
      return result
    } catch (error) {
      throw new Error('error deleting invoice', error)
    }
  }

  static async downloadInvoice ({ fileId }) {
    try {
      await Invoice.find({ fileId })
      const file = downloadFile({ fileId })
      return file
    } catch (error) {
      throw new Error('ID not found')
    }
  }

  static async changeStatus ({ invoiceId, boolean }) {
    if (!boolean) {
      try {
        await Invoice.findByIdAndUpdate(invoiceId, { status: 'accepted' })
        return { status: true }
      } catch (error) {
        throw new Error('Id not found')
      }
    }

    try {
      await Invoice.findByIdAndUpdate(invoiceId, { status: 'rejected' })
      return { status: true }
    } catch (error) {
      throw new Error('Id not found')
    }
  }

  static async invoiceMessage ({ invoiceId, data }) {
    const { message } = data

    try {
      await Invoice.findByIdAndUpdate(invoiceId, { message })
      return { message: 'successfully' }
    } catch (error) {
      throw new Error('internal server error')
    }
  }

  static async checkMessage ({ invoiceId }) {
    try {
      const result = await Invoice.findOne({ _id: invoiceId })
      if (result.message !== 'empty') {
        throw new Error('the invoice already has a message')
      }
    } catch (error) {
      throw new Error('internal server error')
    }
  }
}
