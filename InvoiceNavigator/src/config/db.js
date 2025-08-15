import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.URL_DB
mongoose.set('strictQuery', true)
export const db = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => { console.log('MongoDb connected') })
  .catch(error => console.log(error))

const dataBase = mongoose.connection

// delete files
/* export const deleteFile = async ({ fileId }) => {
  try {
    const bucket = new GridFSBucket(dataBase.db, { bucketName: 'invoices' })
    const id = mongoose.Types.ObjectId(fileId)
    await bucket.delete(id)
  } catch (error) {
    console.log('Error deleting invoice', error)
  }
} */

export const deleteFile = async ({ fileId }) => {
  try {
    const bucket = new GridFSBucket(dataBase.db, { bucketName: 'invoices' })
    const id = new mongoose.Types.ObjectId(fileId)

    const fileExists = await bucket.find({ _id: id }).hasNext()

    if (fileExists) {
      await bucket.delete(id)
    } else {
      console.warn(`file with id ${fileId} not found in GridFS`)
    }
  } catch (error) {
    console.log('Error deleting invoice file', error)
  }
}

// download files
export const downloadFile = async ({ fileId }) => {
  try {
    const bucket = new GridFSBucket(dataBase.db, { bucketName: 'invoices' })
    const file = bucket.openDownloadStream(mongoose.Types.ObjectId(fileId))
    return file
  } catch (error) {
    console.log('Error downloading invoice', error)
  }
}
