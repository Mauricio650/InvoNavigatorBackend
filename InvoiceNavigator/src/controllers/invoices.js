import { validateInvoice, validatePartialInvoice, schemaInvoice, schemaFindInvoice } from '../schemas/invoices.js'
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
    if (!result.success) { return res.status(400).json({ error: 'not valid params', information: result.error }) }

    if (!req.file || !result) {
      return res.status(400).json({ error: 'Insert valid data', errors: result.error })
    }
    try {
      const newInvoice = await this.ModelInvoice.newInvoice({ data: result.data, fileId })
      res.status(201).json({ Inserted: newInvoice, status: true })
    } catch (error) {
      res.status(500).json({ error: `${error.message}` })
    }
  }

  getInvoices = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }

    const end = DateTime.now().setZone('America/Bogota')
    const from = end.startOf('month')

    // User Mood ==> /* aca se comprueba si es role es admin pero lo tengo asi para la gente que pruebe mi proyecto */
    if (data.username !== 'User4' && data.username !== 'Mau31') { /* este usuario es para la gente que quiera ver mi proyecto */
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
      const result = await this.ModelInvoice.getAllInvoices()
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  getFilterInvoices = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }
    const result = validatePartialInvoice(req.body, schemaFindInvoice)
    if (!result.success) { return res.status(400).json({ error: 'not valid params', information: result.error }) }

    const { from, toD } = req.body /* example from: '2025-08-01', toD: '2025-09-12' */
    const newDateFrom = DateTime.fromSQL(from).setZone('America/Bogota')
    const newDateTo = toD ? DateTime.fromSQL(toD).endOf('day').setZone('America/Bogota') : newDateFrom.endOf('day')
    const dataFilters = {
      ...req.body,
      uploadAt: { $gte: newDateFrom.toJSDate(), $lte: newDateTo.toJSDate() },
      to: data.username
    }
    /* keys 'from' and 'to' are not needed because uploadAt is the columns name in mongo db */
    delete dataFilters.from
    delete dataFilters.toD
    if (data.role === 'admin') delete dataFilters.to

    try {
      const jsonResponse = await this.ModelInvoice.getFilterInvoices({ data: dataFilters })
      return res.status(200).json({ invoices: jsonResponse })
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
      return res.status(200).json({ status: true, updateInvoice: invoice })
    } catch (error) {
      res.status(500).json({ error: `${error.message}` })
    }
  }

  validatedUpdateId = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') { return res.status(401).json({ error: 'access not authorized' }) }
    const { id } = req.body
    if (!id) { return res.status(400).json({ error: 'not id' }) }

    try {
      const result = await this.ModelInvoice.validatedUpdateId({ id })
      return res.status(200).json({ data: result })
    } catch (error) {
      res.status(500).json({ error: `${error.message}` })
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
      return res.status(500).json({ error: 'check if the invoice was deleted or the ID is wrong' })
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
      res.status(200).json({ message: 'invoice downloaded' })
    } catch (error) {
      res.status(500).json({ message: `Error: ${error.message}` })
    }
  }

  chStatus = async (req, res) => {
    const data = req.session.user
    if (!data) return res.status(401).json({ error: 'access not authorized' })

    if (!req.params.id) return res.status(404).json({ error: 'please check the id' })
    const invoiceId = req.params.id

    const action = req.body.action
    const boolean = action === 'reject'

    if (!boolean) {
      try {
        const status = await this.ModelInvoice.changeStatus({ invoiceId, boolean })
        res.status(200).json(status)
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` })
      }
    } else {
      try {
        const status = await this.ModelInvoice.changeStatus({ invoiceId, boolean })
        res.status(200).json(status)
      } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` })
      }
    }
  }

  invoiceMessage = async (req, res) => {
    const data = req.session.user
    if (!data) { return res.status(401).json({ error: 'access not authorized' }) }

    if (!req.params.id) { return res.status(404).json({ error: 'please check the id' }) }
    const invoiceId = req.params.id
    const result = validatePartialInvoice(req.body, schemaInvoice)
    if (!result.success) { return res.status(400).json({ error: 'not valid params', information: result.error }) }
    console.log(1)
    try {
      await this.ModelInvoice.checkMessage({ invoiceId })
    } catch (error) {
      return res.status(400).json(error.message)
    }

    try {
      console.log(0)
      const response = await this.ModelInvoice.invoiceMessage({ invoiceId, data: result.data })
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
}
