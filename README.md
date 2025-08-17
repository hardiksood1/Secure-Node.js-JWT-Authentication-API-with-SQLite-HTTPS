# 🚀 Secure Node.js JWT Authentication API with SQLite & HTTPS

A starter project for building a secure Node.js & Express REST API featuring JWT-based authentication, SQLite for persistent storage, protected endpoints, admin user management, password updates, login/logout flows, and HTTPS support using custom certificates.

---

## 🗂️ Project Features

- **User Authentication:** Sign-up, login (JWT bearer tokens), logout (token invalidation).
- **Admin Functions:** Add new users, update user passwords (admin secret required).
- **Protected Routes:** Only access with valid JWT and active token session.
- **Password Security:** Passwords hashed with bcrypt before storage.
- **SQLite Database:** Persistent storage for users and tokens.
- **HTTPS Support:** Secure API access via self-signed or trusted certificates.
- **HTTP to HTTPS Redirect:** Optional redirect of all insecure requests.

---

## 📁 Folder Structure

project/

│── app.js # Main server (HTTPS)

│── db.js # SQLite database logic

│── middleware/

│ └── auth.js # JWT authentication middleware

│── routes/

│ ├── user.js # Admin user management routes

│ ├── login.js # Login + JWT issuing route

│ ├── update.js # Admin password update route

│ ├── protected.js # Example protected route

│ ├── logout.js # Logout and token invalidation

│── certs/

│ ├── server.key # SSL private key

│ └── server.crt # SSL certificate

│── http-redirected.js # HTTP server redirects to HTTPS

│── .env # Environment variables

│── package.json

│── README.md

text

---

## ⚙️ Setup Instructions

1. **Install Dependencies**
    ```
    npm install
    ```

2. **Environment Setup**  
    Create a `.env` file:
    ```
    SECRET_KEY=your_jwt_secret_key
    ADMIN_KEY=your_admin_secret_key
    TOKEN_EXPIRE_SECONDS=900
    PORT=443
    ```

3. **Generate SSL Certificates**  
    Place `server.key` and `server.crt` in the `certs` folder.  
    For development, generate self-signed certs using OpenSSL:
    ```
    openssl req -nodes -new -x509 -keyout certs/server.key -out certs/server.crt
    ```

4. **Run the HTTPS Server**
    ```
    node app.js
    ```

5. **(Optional) Run HTTP → HTTPS Redirect**
    ```
    node http-redirected.js
    ```

---

## 🔒 API Endpoints

| Method | Endpoint              | Protected                   | Description                     |
|--------|----------------------|-----------------------------|---------------------------------|
| POST   | `/user/add`          | Admin Secret Required        | Add a new user (admin only)     |
| POST   | `/update_password`   | Admin Secret Required        | Update user password (admin)    |
| POST   | `/login`             | No                          | Login, receive JWT              |
| GET    | `/protected`         | JWT Token Required           | Access protected resource       |
| POST   | `/logout`            | JWT Token Required           | Logout (token invalidation)     |

---

## 🕵️ Authentication Flow

1. **Login:**  
   POST username/password → Get a JWT bearer token.
2. **Authenticated Request:**  
   Send JWT in `Authorization: Bearer <token>` header.
3. **Logout:**  
   POST to `/logout` with JWT → Token removed, session invalidated.

---

## 🛡️ Security Notes

- Self-signed certificates are fine for local development but will show a warning in browsers. For production, use certs from a trusted CA.
- JWT tokens are stored in DB for session management and invalidation (logout).
- Always safeguard your `.env` secrets.

---

## ✅ Quick Test with curl

Add user (admin only)
curl -X POST https://localhost/user/add
-H "Content-Type: application/json"
-d '{"username":"john","password":"pass","secret_key":"your_admin_secret_key"}'

Login
curl -X POST https://localhost/login
-H "Content-Type: application/json"
-d '{"username":"john","password":"pass"}'

Access protected route
curl https://localhost/protected
-H "Authorization: Bearer <your_token>"

Logout
curl -X POST https://localhost/logout
-H "Authorization: Bearer <your_token>"

text
[![Screenshot 2025-08-16 170410](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/raw/master/Screenshot%202025-08-16%20170410.png)](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/blob/master/Screenshot%202025-08-16%20170410.png)

---

[![Screenshot 2025-08-16 170425](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/raw/master/Screenshot%202025-08-16%20170425.png)](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/blob/master/Screenshot%202025-08-16%20170425.png)

---

[![Screenshot 2025-08-16 170438](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/raw/master/Screenshot%202025-08-16%20170438.png)](https://github.com/hardiksood1/Secure-Node.js-JWT-Authentication-API-with-SQLite-HTTPS/blob/master/Screenshot%202025-08-16%20170438.png)


---

## 📧 Questions / Issues?

Open an issue or reach out for help with install, configuration, or certificate setup!

---

**Happy Developing!**
