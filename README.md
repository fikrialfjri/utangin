# Utangin API Documentation

## Auth API

### POST /api/auth/register
_Register a new user._
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
  - Refer to RegisterAuthDto for full structure
- **Response:**
  - 200 OK — AuthResponse (success)
  - 4xx — Error/Validation details

### POST /api/auth/login
_Login with user credentials._
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
  - Refer to LoginAuthDto for full structure
- **Response:**
  - 200 OK — AuthResponse (token)
  - 401 Unauthorized

## Contact API

### POST /api/contact
_Create a new contact, with optional avatar image._
- **Header:**
  - Authorization: Bearer <token>
- **Request Body:**
  - `name` (string, required)
  - `avatar` (image, optional)
  - Refer to CreateContactDto for any extra fields
- **Response:**
  - 200 OK — ContactResponse
  - 415 Unsupported Media Type (image validation)

### GET /api/contact
_List all contacts for user._
- **Header:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK — list of ContactResponse

### GET /api/contact/:id
_Get single contact detail._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Response:**
  - 200 OK — ContactResponse
  - 404 Not Found

### PUT /api/contact/:id
_Update contact and/or avatar image._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Request Body:**
  - See UpdateContactDto for fields
  - `avatar` (image, optional)
- **Response:**
  - 200 OK — updated ContactResponse

### DELETE /api/contact/:id
_Delete a contact by id._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Response:**
  - 200 OK — deleted ContactResponse

## Profile API

### GET /api/profile
_Get current user profile._
- **Header:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK — ProfileResponse
  - 401 Unauthorized

### PATCH /api/profile/balance
_Update profile balance amount._
- **Header:**
  - Authorization: Bearer <token>
- **Request Body:**
  - `balance` (number, required)
- **Response:**
  - 200 OK — updated ProfileResponse
  - 400/401 on error

## Transaction API

### POST /api/transaction
_Create new transaction._
- **Header:**
  - Authorization: Bearer <token>
- **Request Body:**
  - See CreateTransactionDto for structure
- **Response:**
  - 200 OK — TransactionResponse

### GET /api/transaction
_List all transactions._
- **Header:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK — list of TransactionResponse

### GET /api/transaction/:id
_Get single transaction detail._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Response:**
  - 200 OK — TransactionResponse
  - 404 Not Found

### PUT /api/transaction/:id
_Update a transaction._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Request Body:**
  - See UpdateTransactionDto for fields
- **Response:**
  - 200 OK — updated TransactionResponse

### DELETE /api/transaction/:id
_Delete a transaction by id._
- **Header:**
  - Authorization: Bearer <token>
- **Path Parameter:**
  - `id` (number)
- **Response:**
  - 200 OK — deleted TransactionResponse

---
For full details on DTO/request body/response, refer to the corresponding DTO and Response files inside each `modules` subfolder. Authentication is required for all endpoints except registration and login.
