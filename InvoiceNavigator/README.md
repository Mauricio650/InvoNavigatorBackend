# Invoice Navigator

A web application designed to improve efficiency in the process of accepting, rejecting, and sending documents (like invoices) between departments of a company.

---

This project can be easily modularized and adapted to other processes, such as sending pending invoices to clients or suppliers. In Colombia, many companies use this type of software, where once a purchase is made, the invoice must be uploaded to their website—improving payment times and internal process organization.

Once the invoice is uploaded, a user responsible for validating the purchased items or services received can approve it, triggering a notification to the supplier. After approval, the invoice can move forward to another department to continue the process, depending on whether it was accepted or rejected.

This project is undoubtedly scalable and can be integrated with many more modules, including full integration with ERP systems. In the future, the goal is to optimize and design it to work seamlessly with the **DIAN API** (Colombia's tax authority), which allows companies to perform legally recognized events on invoices—an essential requirement for businesses operating nationwide.

---

> ⚠️ **IMPORTANT!**  
The current plan for this project is to integrate modern technologies such as **React + Vite**, among other libraries, to make it a high-quality and modern application. I originally built it using **Vanilla JS**, **MongoDB**, and **Express.js**, and while it is functional, there is room to improve its performance, interface, logic, and overall structure.

This is a **personal project**, so I'm **not accepting contributions** at the moment. However, you are free to **clone it, modify it as you like, use it, and even commercialize it** if that's what you want. It's intended to be fully **open source**. I would appreciate a **mention or credit** if you do any of those things.

---

### Important Notice:
If, when cloning this repository, you see that it has parts in React in addition to Vanilla JS and it's disorganized, please remember that I am still working on it, and the project may change daily. 😄



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
   git clone https://github.com/Mauricio650/Invoice-Navigator-OSS.git
   cd Invoice-Navigator-OSS
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

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. **Login**: Access the application using your credentials
2. **View Invoices**: The dashboard displays all invoices with their current status
3. **Manage Invoices**: 
   - Click the checkmark icon to accept an invoice
   - Click the X icon to reject an invoice
   - Click the message icon to send a message about a rejected invoice
4. **Download PDFs**: Click the PDF icon to download the invoice document

## Project Structure

```
invoices-to-purchasing/
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── img/              # Images
├── src/                  # Application source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── cors/             # CORS configuration
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── schemas/          # Validation schemas
│   └── views/            # EJS templates
├── app.js                # Application entry point
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## License

ISC

## Author

Mauricio Ibañez Bermudez 
