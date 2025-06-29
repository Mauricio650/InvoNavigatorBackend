import { Router } from 'express'
import { InvoiceController } from '../controllers/invoices.js'
import { upload } from '../config/multer-gridfs.js'

export const createInvoiceRouter = ({ modelInvoice }) => {
  const invoiceRouter = Router()
  const controllerInvoice = new InvoiceController({ ModelInvoice: modelInvoice })

  invoiceRouter.post('/upload', upload.single('myfile'), controllerInvoice.uploadInvoice)

  invoiceRouter.get('/home/invoices', controllerInvoice.getInvoices)

  invoiceRouter.patch('/home/invoices/update/:id', upload.single('myfile'), controllerInvoice.updateInvoice)
  invoiceRouter.patch('/home/updateStatus/:id', controllerInvoice.chStatus)
  invoiceRouter.patch('/home/updateMessage/:id', controllerInvoice.invoiceMessage)

  invoiceRouter.post('/validateId', controllerInvoice.validatedUpdateId)

  invoiceRouter.delete('/home/invoices/delete/:id', controllerInvoice.deleteInvoice)

  invoiceRouter.get('/home/download/:fileId', controllerInvoice.downloadInvoice)

  return invoiceRouter
}
