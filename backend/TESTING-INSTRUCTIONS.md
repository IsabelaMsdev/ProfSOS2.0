# 🧪 Testing Instructions for SoS-prof

## 🚨 **Corporate Firewall Issue**

The MongoDB connection tests are failing due to corporate firewall restrictions. All test files have been organized in the `mongoDbTests/` folder for external testing.

## 📁 **Project Structure**

```
backend/
├── mongoDbTests/           # All MongoDB connection tests
│   ├── QUICK-START.md     # Quick guide for colleague
│   ├── README.md          # Comprehensive test documentation
│   ├── run-tests.js       # Automated test runner
│   ├── simple-test.js     # Basic connection test
│   ├── test-connection.js # Environment-based test
│   ├── test-users.js      # User management tests
│   ├── test-integration.js # Complete integration tests
│   └── ... (diagnostic files)
├── models/                # Mongoose schemas
├── controllers/           # Business logic
├── routes/               # API endpoints
├── config/               # Database configuration
├── server.js             # Main application
└── .env                  # Environment variables
```

## 🎯 **What Needs Testing**

### **Primary Goal:**
Confirm that MongoDB Atlas connection works from non-corporate networks.

### **Secondary Goal:**
Verify the complete SoS-prof application functionality.

## 🚀 **For the Colleague Testing**

### **Quick Test (2 minutes):**
```bash
cd backend
npm install
node mongoDbTests/run-tests.js
```

### **If Connection Works:**
```bash
# Start the server
node server.js

# Test the health endpoint
curl http://localhost:5000/health

# Run application tests
node mongoDbTests/test-users.js
node mongoDbTests/test-integration.js
```

## 📊 **Expected Outcomes**

### ✅ **Success Scenario:**
- Connection tests pass
- Server starts on port 5000
- User registration works
- Ticket system functions correctly

### ❌ **Failure Scenario:**
- Connection tests fail with "IP whitelist" error
- Confirms corporate firewall is blocking MongoDB connections

## 🔧 **MongoDB Atlas Configuration**

The system is configured to connect to:
- **Cluster:** MainCluster (AWS São Paulo)
- **Database:** sos-prof
- **User:** admin
- **Network Access:** 0.0.0.0/0 (allow all IPs)

## 🎯 **System Features to Test**

### **User Management:**
- Register professors, academics, and tech support users
- User authentication and validation
- User activation/deactivation

### **Ticket System:**
- Create support tickets
- Assign technicians based on specialties
- Update ticket status and resolution
- Smart technician suggestions

### **API Endpoints:**
- `/api/users/*` - User management
- `/api/ocorrencias/*` - Ticket management
- `/health` - Health check

## 📝 **Reporting Results**

Please report back:

1. **Connection Status:** ✅/❌ MongoDB connection works
2. **Network Used:** Home/Office/Mobile hotspot
3. **Server Status:** ✅/❌ Server starts successfully
4. **API Status:** ✅/❌ Endpoints respond correctly
5. **Error Messages:** Any specific errors encountered

## 🏗️ **Technical Stack**

- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (cloud)
- **ODM:** Mongoose
- **Authentication:** bcrypt
- **Validation:** Custom + Mongoose validators

## 🎉 **Success Criteria**

The system is ready for production when:
- ✅ MongoDB connection works from external networks
- ✅ All API endpoints function correctly
- ✅ User registration and ticket creation work
- ✅ Integration tests pass

---

**Note:** This is a complete ticket management system for educational institutions. Once connection is confirmed, it's ready for deployment and use.
