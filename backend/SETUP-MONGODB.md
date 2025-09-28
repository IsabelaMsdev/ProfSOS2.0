# MongoDB Setup Guide - SoS-prof

## 📋 Current Status

✅ **Completed:**
- `.env` file created with MongoDB configuration template
- Server code updated to use environment variables
- Database connection enhanced with better error handling
- Health check endpoint added (`/health`)
- Connection test script created

## 🔧 Next Steps

### 1. **Update Your MongoDB Connection String**

You already have a MongoDB Atlas connection string in your `.env` file:
```
MONGO_URI=mongodb+srv://admin:<db_password>@maincluster.kwft3f0.mongodb.net/sos-prof?retryWrites=true&w=majority&appName=MainCluster
```

**Replace `<db_password>` with your actual database password.**

### 2. **Test the Connection**

Run the connection test script:
```bash
node test-connection.js
```

This will:
- ✅ Verify environment variables are loaded
- ✅ Test MongoDB connection
- ✅ List existing collections
- ✅ Provide helpful error messages if something fails

### 3. **Start the Server**

Once the connection test passes:
```bash
node server.js
```

You should see:
```
🔄 Conectando ao MongoDB...
✅ MongoDB conectado com sucesso!
📊 Database: sos-prof
Servidor rodando na porta 5000
```

### 4. **Test the Health Check**

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-27T18:30:00.000Z",
  "environment": "development"
}
```

## 🚨 Common Issues & Solutions

### **Authentication Failed**
```
MongoServerError: bad auth : authentication failed
```
**Solution:** Check your username and password in the connection string.

### **Network Error**
```
MongoNetworkError: connection timed out
```
**Solutions:**
- Check internet connection
- Verify IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for development)
- Ensure firewall isn't blocking the connection

### **Database Not Found**
The database `sos-prof` will be created automatically when you insert the first document.

### **Environment Variables Not Loading**
```
❌ ERRO: MONGO_URI não está definida no arquivo .env
```
**Solutions:**
- Ensure `.env` file is in the `backend/` directory
- Check file permissions
- Restart the server after editing `.env`

## 📊 MongoDB Atlas Setup (If Needed)

If you need to set up MongoDB Atlas from scratch:

1. **Create Account:** https://www.mongodb.com/atlas
2. **Create Cluster:** Choose free tier (M0)
3. **Create Database User:**
   - Go to Database Access
   - Add new user with read/write permissions
4. **Whitelist IP:**
   - Go to Network Access
   - Add IP address (use `0.0.0.0/0` for development)
5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## 🧪 Test Your Setup

After connecting successfully, run the integration tests:

```bash
# Test user functionality
node test-users.js

# Test complete integration
node test-integration.js
```

## 📁 File Structure After Setup

```
backend/
├── .env                    # ✅ Environment variables
├── config/db.js           # ✅ Enhanced DB connection
├── server.js              # ✅ Updated server with env checks
├── test-connection.js     # ✅ Connection test script
├── models/
│   ├── User.js           # ✅ User model
│   └── Ocorrencia.js     # ✅ Enhanced ticket model
├── controllers/          # ✅ All controllers updated
├── routes/              # ✅ All routes configured
└── test files           # ✅ Comprehensive tests
```

## 🎯 Ready to Use Features

Once connected, your system will have:

- ✅ User registration (professors, academics, support)
- ✅ Ticket creation and management
- ✅ Smart technician assignment
- ✅ Complete filtering and search
- ✅ Health monitoring
- ✅ Comprehensive error handling

## 🆘 Need Help?

If you encounter issues:

1. **Run the connection test:** `node test-connection.js`
2. **Check the logs** when starting the server
3. **Verify your `.env` file** has the correct connection string
4. **Test the health endpoint** to ensure the server is running

The system is now ready for MongoDB connection! Just update your password in the `.env` file and run the tests.
