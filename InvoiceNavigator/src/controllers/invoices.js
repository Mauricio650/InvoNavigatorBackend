import { validateInvoice, validatePartialInvoice, schemaInvoice } from '../schemas/invoices.js'
import { DateTime } from 'luxon'

export class InvoiceController {
  constructor ({ ModelInvoice }) {
    this.ModelInvoice = ModelInvoice
  }

  uploadInvoice = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') { return res.status(401).json({ error: 'access not authorized' }) }
    const fileId = req.file.id
    const result = validateInvoice(req.body, schemaInvoice)

    if (!req.file || !result) {
      return res.status(400).json({ error: 'Insert valid data', errors: result.error })
    }

    try {
      const newInvoice = await this.ModelInvoice.newInvoice({ data: result.data, fileId })
      res.status(201).json({ Inserted: newInvoice, status: true })
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  getInvoices = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }

    const end = DateTime.now().setZone('America/Bogota')
    const from = end.startOf('month')

    // User Mood ==>
    if (data.role !== 'admin') {
      try {
        /* ALL INVOICES IN ACTUAL MONTH FOR USER */
        const result = await this.ModelInvoice.getInvoices({ username: data.username, from, end })
        return res.status(200).json(result)
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` })
      }
    }
    // Admin Mood ==>
    try {
      /* ALL INVOICES IN ACTUAL MONTH */
      const result = await this.ModelInvoice.getAllInvoices({ from, end })
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  updateInvoice = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') { return res.status(401).json({ error: 'access not authorized' }) }
    const { id } = req.params
    if (!id) { return res.status(400).json({ error: 'insert a valid query (id)' }) }
    const result = validatePartialInvoice(req.body, schemaInvoice)
    if (!result.success) { return res.status(400).json({ error: 'not valid params', information: result.error }) }
    const fileId = req.file?.id || false
    try {
      const invoice = await this.ModelInvoice.updateInvoice({ data: result.data, id, fileId })
      return res.status(200).json({ updateInvoice: invoice })
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  validatedUpdateId = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') { return res.status(401).json({ error: 'access not authorized' }) }
    const { id } = req.body
    if (!id) { return res.status(400).json({ error: 'not id' }) }

    try {
      const result = await this.ModelInvoice.validatedUpdateId({ id })
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  deleteInvoice = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') { return res.status(401).json({ error: 'access not authorized' }) }
    const { id } = req.params
    if (!id) { return res.status(400).json({ error: 'ID is needed' }) }

    try {
      await this.ModelInvoice.deleteInvoice({ id })
      return res.status(200).json({ message: 'Invoices deleted successfully' })
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  downloadInvoice = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }
    const fileId = req.params.fileId
    if (!fileId) { return res.status(404).json({ error: 'Id not found' }) }
    try {
      const file = await this.ModelInvoice.downloadInvoice({ fileId })
      res.setHeader('content-Type', 'application/pdf')
      file.pipe(res)
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  chStatus = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }

    if (!req.params.id) { return res.status(404).json({ error: 'please check the id' }) }
    const invoiceId = req.params.id

    const action = req.body.action
    const boolean = action === 'reject'

    if (!boolean) {
      try {
        const status = await this.ModelInvoice.changeStatus({ invoiceId, boolean })
        return status
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` })
      }
    }

    try {
      const status = await this.ModelInvoice.changeStatus({ invoiceId, boolean })
      return status
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  invoiceMessage = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }

    if (!req.params.id) { return res.status(404).json({ error: 'please check the id' }) }
    const invoiceId = req.params.id
    const result = validatePartialInvoice(req.body, schemaInvoice)
    if (!result.success) { return res.status(400).json({ error: 'not valid params', information: result.error }) }

    try {
      await this.ModelInvoice.checkMessage({ invoiceId })
    } catch (error) {
      return res.status(400).json({ message: `Error: ${error.message}` })
    }

    try {
      const response = await this.ModelInvoice.invoiceMessage({ invoiceId, data: result.data })
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json({ message: `Error: ${error.message}` })
    }
  }
}
