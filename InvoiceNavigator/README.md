# Invoice Navigator

A web application designed to improve efficiency in the process of accepting, rejecting, and sending documents (like invoices) between departments of a company.

---
## Overview

This application streamlines the document management workflow by providing a user-friendly interface for handling documents. It allows users to:

- Upload, update and delete documents (invoices)
- View all invoices in a tabular format
- Accept or reject invoices with a single click
- Track invoice status (pending, accepted, rejected)
- Visualize invoice statistics with charts
- Download invoice PDFs
- Send messages regarding rejected invoices

## Features

- **Dashboard**: Visual representation of invoice statistics with a doughnut chart
- **Invoice Management**: Table view of all invoices with filtering and sorting capabilities
- **Status Tracking**: Clear visual indicators for invoice status (pending, accepted, rejected)
- **PDF Access**: Direct download links for invoice PDFs
- **User Authentication**: Secure login system with JWT refresh tokens for enhanced security
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Multer & GridFS**: File storage
- **Zod**: Schema validation


## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Mauricio650/InvoNavigatorBackend.git
   cd InvoNavigatorBackend.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET_KEY='your_secret_key'
    URL_DB='mongodb://000000/database'
    PORT=4000
   ```

   for test you need a admin user
   ```
   USER_TEST='XXXX'
   PASSWORD_TEST='XXXX'
   ```

4. Start the development server:
   ```
   npm start
   ```


## Project Structure

```
InvoiceNavigator/
├── src/
│   ├── config/
│   │   ├── createApp.js
│   │   ├── db.js
│   │   └── multer-gridfs.js
│   ├── controllers/
│   │   ├── invoices.js
│   │   └── users.js
│   ├── cors/
│   │   └── cors.js
│   ├── models/
│   │   └── mongoDB/
│   │       ├── invoices.js
│   │       ├── schemaInvoice.js
│   │       ├── schemaUser.js
│   │       └── users.js
│   ├── routes/
│   │   ├── invoices.js
│   │   └── users.js
│   ├── schemas/
│   │   ├── invoices.js
│   │   └── users.js
│   └── test/
│       ├── fixtures/
│       │   └── test.pdf
│       └── endToEnd.test.js
├── .env
├── app.js
├── package.json
```

## License

ISC

## Author

Mauricio Ibañez Bermudez
