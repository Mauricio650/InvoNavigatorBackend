# Invoice Navigator

An enterprise web platform designed based on real business processes within a company.

![Status](https://img.shields.io/badge/finished-green?style=for-the-badge)


## 📚 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Installation and usage](#-installation-and-usage)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)


## 🧠 About

it's a project created to improve invoices management in companies, providing full control over invoices status and tracking across departments.


## 🌟 Features

- API REST
- Modular architecture with model injection
- MVC design pattern
- CRUD for invoices and users
- Data validation with zod
- User authentication with JWT
- Role-based access control and route protection
- Password encryption with bcrypt
- File management with mongo and multer
- Route testing with jest


## ⚙️ Installation and usage

0. You need to have a mongo db in your pc and have a url of connection

1. Clone the repository:
   ```
   git clone https://github.com/Mauricio650/InvoNavigatorBackend.git
   cd InvoNavigatorBackend/InvoiceNavigator/
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
    JWT_SECRET_KEY='your_secret_key'
    URL_DB='Your mongo db'
    PORT=4000
   ```

   to running tests you must a admin user
   ```
   USER_TEST='XXXX'
   PASSWORD_TEST='XXXX'
   ```

4. Start the development server:
   ```
   npm start
   ```

**Important**

>  🧩 Note: The Frontend of this project is available in a separate repository
[Invoice navigator Frontend](https://github.com/Mauricio650/InvoNavigator)

## 🧰 Tech stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Multer & GridFS**: File storage
- **Zod**: Schema validation


## 🤝 Contributing

Contributions, issues, and features requests are welcome!
Feel free to fork this repo and submit and pull request.


> 🧩 Remember: to create a new route, you must:
> 1. Create a new route in `src/routes/`
> 2. Create a controller function in `src/controllers/`
> 3. Create a model function in `src/models/`
> 4. Add a new test for that route in `src/test/endToEnd.test.js`

> if you need create a new scheme just do it.


## 📄 License

This project is licensed under MIT License


## 👤 Author

**Mauricio ibañez bermudez**
**GitHub:** https://github.com/Mauricio650
