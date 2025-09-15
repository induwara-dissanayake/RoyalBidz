# ??? XAMPP MySQL Setup Guide for RoyalBidz

## ? **Pre-Setup Checklist**

### 1. **Start XAMPP Services**
- [ ] Open XAMPP Control Panel
- [ ] Click **"Start"** next to **Apache**
- [ ] Click **"Start"** next to **MySQL**
- [ ] Both should show **green "Running"** status

### 2. **Create Database**
- [ ] Open browser and go to: `http://localhost/phpmyadmin`
- [ ] Click **"New"** in left sidebar
- [ ] Enter database name: **`RoyalBidz`**
- [ ] Click **"Create"**

### 3. **Verify MySQL Port (Default: 3306)**
- In XAMPP Control Panel, click **"Config"** next to MySQL
- Select **"my.ini"**
- Look for: `port = 3306` (should be default)

## ?? **Running the Application**

### Current Connection String:
```
Server=localhost;Database=RoyalBidz;User=root;Password=;Port=3306;Convert Zero Datetime=True;
```

### Expected Results When You Run:
1. **? Success Messages:**
   ```
   ?? Checking database connection...
   ? Database connection successful!
   ? Database and tables created successfully!
   ?? Found X users in database
   ```

2. **? If You See Errors:**
   - Check the console output for specific error messages
   - Follow the troubleshooting steps below

## ?? **Troubleshooting Common Issues**

### **Issue 1: "Unable to connect to MySQL hosts"**
**Solution:**
- [ ] Ensure XAMPP MySQL is running (green status)
- [ ] Check if port 3306 is being used by another service
- [ ] Restart XAMPP services

### **Issue 2: "Database 'RoyalBidz' doesn't exist"**
**Solution:**
- [ ] Go to `http://localhost/phpmyadmin`
- [ ] Create database named exactly: `RoyalBidz` (case-sensitive)

### **Issue 3: "Access denied for user 'root'"**
**Solution:**
- Default XAMPP MySQL has no password for root
- If you set a password, update appsettings.json:
  ```json
  "DefaultConnection": "Server=localhost;Database=RoyalBidz;User=root;Password=YOUR_PASSWORD;Port=3306;"
  ```

### **Issue 4: Different MySQL Port**
**Solution:**
- Check XAMPP MySQL port in Control Panel
- Update appsettings.json if different from 3306

## ?? **What Happens After Successful Setup**

### **Automatic Database Creation:**
The application will automatically create these tables:
- `Users` (with 3 sample accounts)
- `JewelryItems` (with sample jewelry)
- `JewelryImages` (with image references)
- `Auctions` (with active sample auctions)
- `Bids` (initially empty)
- `Payments` (initially empty)

### **Sample Data Created:**
- **Admin**: admin@royalbidz.com / Admin123!
- **Seller**: seller@royalbidz.com / Seller123!
- **Buyer**: buyer@royalbidz.com / Buyer123!

### **Access Points:**
- **Application**: `https://localhost:7071`
- **API Documentation**: `https://localhost:7071/swagger`
- **phpMyAdmin**: `http://localhost/phpmyadmin`

## ?? **Quick Test After Setup**

1. **Start Application** (`F5` or `dotnet run`)
2. **Check Console** for success messages
3. **Open Browser**: `https://localhost:7071`
4. **Test API**: `https://localhost:7071/swagger`
5. **Check Database**: Go to phpMyAdmin and see RoyalBidz database with tables

## ?? **Still Having Issues?**

### **Check XAMPP MySQL Log:**
1. In XAMPP Control Panel, click **"Logs"** next to MySQL
2. Look for any error messages

### **Alternative Connection Strings to Try:**
```json
// Option 1: With explicit charset
"Server=localhost;Database=RoyalBidz;User=root;Password=;Port=3306;CharSet=utf8mb4;"

// Option 2: With connection timeout
"Server=localhost;Database=RoyalBidz;User=root;Password=;Port=3306;Connection Timeout=30;"

// Option 3: If using different port (e.g., 3307)
"Server=localhost;Database=RoyalBidz;User=root;Password=;Port=3307;"
```

## ? **Success Indicators**

When everything is working correctly, you should see:
- ? XAMPP MySQL running (green)
- ? RoyalBidz database in phpMyAdmin
- ? Application starts without errors
- ? Console shows database connection success
- ? Swagger API documentation loads
- ? Can login with sample accounts

---

**?? Once this is working, your RoyalBidz auction platform is ready for development and testing!**