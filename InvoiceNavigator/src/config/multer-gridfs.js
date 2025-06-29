import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import dotenv from 'dotenv'

dotenv.config()
const dbUrl = process.env.URL_DB

const storage = new GridFsStorage({
  url: dbUrl,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'invoices'
    }
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    cb(new Error('only PDF documents'), false)
  }
  cb(null, true)
}

export const upload = multer({ storage, fileFilter })
