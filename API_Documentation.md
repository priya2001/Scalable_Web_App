# API Documentation - Scalable Web App

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user id",
    "name": "user name",
    "email": "user email",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Status Codes:**
- 201: User created successfully
- 400: Validation error or user already exists
- 500: Server error

---

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "token": "JWT token",
  "user": {
    "_id": "user id",
    "name": "user name",
    "email": "user email",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Status Codes:**
- 200: Login successful
- 400: Invalid credentials
- 500: Server error

---

### User Profile (Requires Authentication)

#### GET /auth/profile
Retrieve the authenticated user's profile.

**Response:**
```json
{
  "_id": "user id",
  "name": "user name",
  "email": "user email",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Status Codes:**
- 200: Profile retrieved successfully
- 401: Unauthorized (invalid/no token)
- 404: User not found
- 500: Server error

---

#### PUT /auth/profile
Update the authenticated user's profile.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)"
}
```

**Response:**
```json
{
  "_id": "user id",
  "name": "updated name",
  "email": "updated email",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Status Codes:**
- 200: Profile updated successfully
- 400: Validation error
- 401: Unauthorized (invalid/no token)
- 404: User not found
- 500: Server error

---

### Notes (Requires Authentication)

#### GET /notes
Retrieve all notes for the authenticated user.

**Query Parameters:**
- `search` (optional): Search term to filter notes by title or content
- `sortBy` (optional): Field to sort by (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)
- `limit` (optional): Number of results per page (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "notes": [
    {
      "_id": "note id",
      "title": "note title",
      "content": "note content",
      "userId": "user id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "pagination": {
    "total": "total number of notes",
    "page": "current page",
    "pages": "total number of pages",
    "limit": "number of results per page"
  }
}
```

**Status Codes:**
- 200: Notes retrieved successfully
- 401: Unauthorized (invalid/no token)
- 500: Server error

---

#### POST /notes
Create a new note.

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)"
}
```

**Response:**
```json
{
  "_id": "note id",
  "title": "note title",
  "content": "note content",
  "userId": "user id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Status Codes:**
- 201: Note created successfully
- 400: Validation error (missing title or content)
- 401: Unauthorized (invalid/no token)
- 500: Server error

---

#### GET /notes/:id
Retrieve a specific note by ID.

**Response:**
```json
{
  "_id": "note id",
  "title": "note title",
  "content": "note content",
  "userId": "user id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Status Codes:**
- 200: Note retrieved successfully
- 401: Unauthorized (invalid/no token)
- 404: Note not found
- 500: Server error

---

#### PUT /notes/:id
Update a specific note by ID.

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)"
}
```

**Response:**
```json
{
  "_id": "note id",
  "title": "updated note title",
  "content": "updated note content",
  "userId": "user id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Status Codes:**
- 200: Note updated successfully
- 400: Validation error (missing title or content)
- 401: Unauthorized (invalid/no token)
- 404: Note not found
- 500: Server error

---

#### DELETE /notes/:id
Delete a specific note by ID.

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

**Status Codes:**
- 200: Note deleted successfully
- 401: Unauthorized (invalid/no token)
- 404: Note not found
- 500: Server error