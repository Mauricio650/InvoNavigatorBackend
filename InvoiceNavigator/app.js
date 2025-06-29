import { createApp } from './src/config/createApp.js'
import { ModelUser } from './src/models/mongoDB/users.js'
import { InvoiceModel } from './src/models/mongoDB/invoices.js'

createApp({ modelUser: ModelUser, modelInvoice: InvoiceModel })
