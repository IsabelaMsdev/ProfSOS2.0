# MongoDB Connection Tests - SoS-prof

## 🚨 **Corporate Firewall Issue**

This folder contains comprehensive MongoDB connection tests. The original developer cannot connect due to corporate firewall restrictions blocking MongoDB connections (port 27017/27017+srv).

## 📋 **Test Files Overview**

### **Quick Tests (Start Here)**
1. **`simple-test.js`** - Basic connection test with hardcoded credentials
2. **`test-connection.js`** - Standard connection test using .env file

### **Diagnostic Tests**
3. **`diagnose-connection.js`** - Complete network and connection diagnostics
4. **`debug-atlas.js`** - Atlas-specific debugging
5. **`atlas-config-check.js`** - Configuration checklist and troubleshooting guide

### **Advanced Tests**
6. **`test-existing-db.js`** - Tests connection to different databases
7. **`timeout-test.js`** - Tests various timeout configurations
8. **`detailed-test.js`** - Comprehensive connection analysis

### **Application Tests**
9. **`test-users.js`** - Tests user management functionality
10. **`test-integration.js`** - Complete integration test (users + tickets)

## 🚀 **Quick Start for Colleague**

### **Step 1: Setup**
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB credentials
cp .env.example .env  # If exists, or create manually
```

### **Step 2: Update .env File**
Create/update `.env` in the backend folder:
```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://admin:qRoLhi2oc7VBwhHO@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster

# Server Configuration
PORT=5000

# Environment
NODE_ENV=development
```

### **Step 3: Run Tests**
```bash
# Quick connection test
node mongoDbTests/simple-test.js

# Standard test with .env
node mongoDbTests/test-connection.js

# If those work, test the application
node mongoDbTests/test-users.js
node mongoDbTests/test-integration.js
```

## 📊 **Expected Results**

### **If Connection Works:**
```
✅ SUCESSO! Conexão estabelecida
   Host: maincluster-shard-00-02.kwft3f0.mongodb.net
   Database: sos-prof
   Estado: 1
✅ Ping bem-sucedido
```

### **If Corporate Firewall Blocks:**
```
❌ ERRO: Could not connect to any servers in your MongoDB Atlas cluster
```

## 🛠️ **Troubleshooting for Colleague**

### **If Tests Fail:**

1. **Check Network Access in Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is listed and ACTIVE

2. **Verify Database User:**
   - Go to Database Access
   - User `admin` should exist and be Active
   - Password should be `qRoLhi2oc7VBwhHO`

3. **Try Different Network:**
   - Test from home network
   - Use mobile hotspot
   - If works = corporate firewall issue

### **If Tests Pass:**

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Test API endpoints:**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Register a user
   curl -X POST http://localhost:5000/api/users/registrar \
     -H "Content-Type: application/json" \
     -d '{
       "nome": "Test User",
       "email": "test@example.com",
       "senha": "test123",
       "tipo": "professor",
       "instituicao": "Test University"
     }'
   ```

## 🎯 **What We're Testing**

### **Database Connection:**
- ✅ MongoDB Atlas connectivity
- ✅ Authentication with admin user
- ✅ Database operations (read/write)
- ✅ Network accessibility

### **Application Features:**
- ✅ User registration (professors, academics, support)
- ✅ Ticket creation and management
- ✅ Technician assignment
- ✅ Complete CRUD operations

## 📝 **Report Back**

Please test and report:

1. **Connection Status:**
   - ✅/❌ `simple-test.js` result
   - ✅/❌ `test-connection.js` result

2. **Application Status:**
   - ✅/❌ Server starts successfully
   - ✅/❌ User registration works
   - ✅/❌ Integration tests pass

3. **Network Info:**
   - What network are you using? (home/office/mobile)
   - Any firewall/proxy restrictions?

## 🏗️ **System Architecture**

The SoS-prof system includes:

- **User Management:** Professors, academics, and tech support users
- **Ticket System:** Create, assign, and track support tickets
- **Smart Assignment:** Automatic technician suggestions based on specialties
- **Complete API:** RESTful endpoints for all operations

## 🔧 **Technical Details**

- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB Atlas (cloud)
- **Authentication:** bcrypt for password hashing
- **Validation:** Comprehensive input validation
- **Error Handling:** Global error middleware

---

**Note:** If connection tests pass, the system is ready for production use. The corporate firewall is the only blocker for the original developer.
