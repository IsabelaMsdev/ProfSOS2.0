# 🔐 JWT Authentication Testing Guide

## 📋 **Setup Required**

### **1. Update your .env file:**
Add these JWT secrets to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here-make-it-different-and-long
```

### **2. Restart your server:**
```bash
node server.js
```

---

## 🧪 **Testing Authentication Flow**

### **Step 1: Register a User (Public Route)**
**Method:** `POST`  
**URL:** `http://localhost:5000/api/users/registrar`  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@test.com",
  "senha": "senha123",
  "tipo": "professor",
  "instituicao": "IESB",
  "departamento": "TI"
}
```

**Expected Response:**
```json
{
  "message": "Usuário registrado com sucesso",
  "usuario": {
    "_id": "...",
    "nome": "João Silva",
    "email": "joao@test.com",
    "tipo": "professor"
  }
}
```

### **Step 2: Login (Public Route)**
**Method:** `POST`  
**URL:** `http://localhost:5000/api/users/login`  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "joao@test.com",
  "senha": "senha123"
}
```

**Expected Response:**
```json
{
  "message": "Login bem-sucedido",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "...",
    "nome": "João Silva",
    "email": "joao@test.com",
    "tipo": "professor"
  }
}
```

**⚠️ IMPORTANT:** Copy the `accessToken` from the response!

### **Step 3: Test Protected Route**
**Method:** `GET`  
**URL:** `http://localhost:5000/api/users`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

**Expected Response (if user is suporte):**
```json
{
  "usuarios": [...],
  "total": 1
}
```

**Expected Response (if user is NOT suporte):**
```json
{
  "message": "Acesso negado. Requer um dos seguintes tipos: suporte"
}
```

### **Step 4: Test Token Refresh**
**Method:** `POST`  
**URL:** `http://localhost:5000/api/users/refresh-token`  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Step 5: Test Logout**
**Method:** `POST`  
**URL:** `http://localhost:5000/api/users/logout`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

**Body:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

---

## 🎯 **Testing Different User Types**

### **Create Support User:**
```json
{
  "nome": "Admin Suporte",
  "email": "admin@test.com",
  "senha": "senha123",
  "tipo": "suporte",
  "instituicao": "IESB",
  "nivel_suporte": "admin",
  "especialidades": ["hardware", "software"]
}
```

### **Create Academic User:**
```json
{
  "nome": "Maria Acadêmica",
  "email": "maria@test.com",
  "senha": "senha123",
  "tipo": "academico",
  "instituicao": "IESB",
  "curso": "Engenharia",
  "matricula": "2023001"
}
```

---

## 🔒 **Protected Routes Testing**

### **Routes that require ANY authenticated user:**
- `GET /api/ocorrencias` - List tickets
- `POST /api/ocorrencias` - Create ticket
- `GET /api/ocorrencias/:id` - Get ticket by ID
- `PUT /api/ocorrencias/:id` - Update ticket

### **Routes that require SUPORTE role:**
- `GET /api/users` - List all users
- `PATCH /api/ocorrencias/:id/atribuir` - Assign technician
- `DELETE /api/ocorrencias/:id` - Delete ticket

### **Routes that require OWNERSHIP or ADMIN:**
- `GET /api/users/:id` - Get user by ID (own data or admin)
- `PUT /api/users/:id` - Update user (own data or admin)

---

## 🧪 **Error Testing**

### **Test Invalid Token:**
Use an invalid or expired token:
```
Authorization: Bearer invalid_token_here
```
**Expected:** `403 Forbidden - Token inválido`

### **Test Missing Token:**
Don't include Authorization header:
**Expected:** `401 Unauthorized - Token de acesso requerido`

### **Test Wrong Role:**
Login as `professor` and try to access suporte-only routes:
**Expected:** `403 Forbidden - Acesso negado`

### **Test Inactive User:**
If you deactivate a user and they try to use their token:
**Expected:** `401 Unauthorized - Usuário inativo`

---

## 📊 **Token Information**

### **Access Token (15 minutes):**
- Contains: `id`, `tipo`, `email`
- Used for: API requests
- Short-lived for security

### **Refresh Token (7 days):**
- Contains: `id` only
- Used for: Getting new access tokens
- Stored in database for validation

---

## 🔧 **Insomnia Collection Setup**

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:5000`
   - `access_token`: (will be set after login)
   - `refresh_token`: (will be set after login)

2. **Set Authorization Header:**
   ```
   Authorization: Bearer {{ _.access_token }}
   ```

3. **Auto-update tokens:**
   After login, copy tokens to environment variables for reuse.

---

## 🚨 **Security Notes**

1. **Never log tokens** in production
2. **Use HTTPS** in production
3. **Rotate JWT secrets** regularly
4. **Implement rate limiting** for login attempts
5. **Consider shorter token expiry** for high-security environments

---

## ✅ **Success Criteria**

- ✅ Users can register and login
- ✅ Tokens are generated and validated
- ✅ Protected routes require authentication
- ✅ Role-based access control works
- ✅ Token refresh works
- ✅ Logout invalidates tokens
- ✅ Expired tokens are rejected
