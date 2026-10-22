# 📸 XAMPP Visual Setup Guide - Step by Step

## 🎯 Complete Setup in 10 Steps (with Screenshots Reference)

### ✅ Step 1: Install XAMPP
- Download from: https://www.apachefriends.org/
- Install to default location: `C:\xampp`
- ✅ Make sure to select MySQL during installation

---

### ✅ Step 2: Start XAMPP Control Panel
1. Open **XAMPP Control Panel** from Start Menu
2. You should see a window with Apache, MySQL, FileZilla, etc.

---

### ✅ Step 3: Start MySQL Service
1. In XAMPP Control Panel, find the **MySQL** row
2. Click the **"Start"** button
3. Wait until it shows **green "Running"** status
4. Port should show: **3306**

```
Module    PID(s)    Port(s)    Status
MySQL     1234      3306       Running  ← Should look like this
```

---

### ✅ Step 4: Open phpMyAdmin
**Option 1:** Click **"Admin"** button next to MySQL in XAMPP Control Panel

**Option 2:** Open browser and go to:
```
http://localhost/phpmyadmin
```

You should see the phpMyAdmin interface.

---

### ✅ Step 5: Create Database
1. In phpMyAdmin, look at the **left sidebar**
2. Click **"New"** at the top of the sidebar
3. You'll see "Create database" screen:
   - **Database name:** `expense_tracker`
   - **Collation:** `utf8mb4_general_ci` (select from dropdown)
4. Click **"Create"** button
5. Success! You should see `expense_tracker` in the left sidebar

---

### ✅ Step 6: Create Tables
1. Click on **`expense_tracker`** database in left sidebar
2. Click **"SQL"** tab at the top
3. You'll see a text box for SQL queries
4. **Copy and paste** this entire code:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category ENUM('Home', 'Food', 'College', 'Travel', 'Other') NOT NULL,
    description VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

5. Click **"Go"** button (bottom right)
6. Success message: **"2 rows affected"** or **"MySQL returned an empty result set"**

---

### ✅ Step 7: Verify Tables Created
1. Still in phpMyAdmin
2. Click on **`expense_tracker`** database (left sidebar)
3. Click **"Structure"** tab
4. You should see **2 tables:**
   - ✅ `expenses` (11 columns)
   - ✅ `users` (4 columns)

**Perfect! Database is ready!** 🎉

---

### ✅ Step 8: Configure Project
1. Extract the `expense-tracker` folder to any location, for example:
   ```
   C:\Users\YourName\Documents\expense-tracker
   ```

2. Open `.env` file in a text editor (Notepad, VS Code, etc.)

3. **For XAMPP, use these settings:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=expense_tracker
   PORT=3000
   SESSION_SECRET=my_secret_key_123
   ```

   ⚠️ **Important:** 
   - `DB_PASSWORD=` (leave EMPTY - no password for default XAMPP)
   - If you set a password in XAMPP, put it here

4. Save the `.env` file

---

### ✅ Step 9: Install Dependencies
1. Open **Command Prompt** or **Terminal**
2. Navigate to project folder:
   ```bash
   cd C:\Users\YourName\Documents\expense-tracker
   ```

3. Install packages:
   ```bash
   npm install
   ```

4. Wait 2-3 minutes for installation to complete
5. You should see: `added XX packages`

---

### ✅ Step 10: Start the Application
1. In the same Command Prompt, type:
   ```bash
   npm start
   ```

2. You should see:
   ```
   ╔════════════════════════════════════════════╗
   ║   💰 Expense Tracker Server Running       ║
   ║   🌐 URL: http://localhost:3000           ║
   ╚════════════════════════════════════════════╝
   ✅ Database connected successfully
   ```

3. **Success!** 🎉

---

### ✅ Step 11: Open in Browser
1. Open your browser (Chrome, Firefox, Edge)
2. Go to:
   ```
   http://localhost:3000
   ```

3. You should see the **Login Page**

---

### ✅ Step 12: Test the Application
1. Click **"Sign Up"**
2. Create an account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Sign Up"**
4. You'll be logged in automatically → **Dashboard**
5. Try adding an expense!

---

## 🔍 Checking Your Data in phpMyAdmin

After adding expenses:

1. Go to phpMyAdmin: `http://localhost/phpmyadmin`
2. Click `expense_tracker` database
3. Click `users` table → Click **"Browse"**
   - You should see your user account
4. Click `expenses` table → Click **"Browse"**
   - You should see your expenses

---

## 🎯 What Each Window Should Show

### XAMPP Control Panel
```
[X] MySQL    [Running]    Port: 3306    [Stop] [Admin] [Config]
```

### Command Prompt (after npm start)
```
Server running on http://localhost:3000
Database connected successfully
```

### Browser (Login Page)
```
💰
Welcome Back
Login to manage your expenses

Email: [_____________]
Password: [_____________]
[Login]
```

---

## 🚨 Troubleshooting Visual Guide

### Problem: MySQL won't start in XAMPP
**What you see:** Red status or error message

**Fix:**
1. XAMPP Control Panel → Click "Config" next to MySQL
2. Select "my.ini"
3. Find line: `port=3306`
4. Change to: `port=3307`
5. Save file
6. Update `.env`: `DB_HOST=localhost:3307`
7. Try starting MySQL again

---

### Problem: "Database connection failed"
**What you see:** Red error in Command Prompt

**Check:**
1. ✅ Is MySQL **green "Running"** in XAMPP?
2. ✅ Does `expense_tracker` database exist in phpMyAdmin?
3. ✅ Is `.env` file correct? (especially `DB_PASSWORD=` empty)
4. ✅ Are tables created? Check phpMyAdmin → Structure

---

### Problem: Port 3000 already in use
**What you see:** "EADDRINUSE: address already in use :::3000"

**Fix:**
1. Change in `.env`: `PORT=3001`
2. Restart: `npm start`
3. Open: `http://localhost:3001`

---

## 📝 Quick Reference

### XAMPP Locations
```
XAMPP Installed:     C:\xampp\
MySQL Data:          C:\xampp\mysql\data\
phpMyAdmin:          http://localhost/phpmyadmin
Config File:         C:\xampp\mysql\bin\my.ini
```

### Default Credentials
```
MySQL Username:      root
MySQL Password:      (empty)
phpMyAdmin URL:      http://localhost/phpmyadmin
```

### Application URLs
```
App Home:            http://localhost:3000
Login:               http://localhost:3000/login
Signup:              http://localhost:3000/signup
Dashboard:           http://localhost:3000/dashboard
Expenses:            http://localhost:3000/expenses
```

---

## ✅ Verification Checklist

Before testing, make sure:
- [ ] XAMPP MySQL is **green "Running"**
- [ ] Database `expense_tracker` exists in phpMyAdmin
- [ ] Tables `users` and `expenses` exist (Structure tab)
- [ ] `.env` file has `DB_PASSWORD=` (empty)
- [ ] `npm install` completed successfully
- [ ] Command prompt shows "Database connected successfully"
- [ ] Browser opens `http://localhost:3000`

---

## 🎓 First Time Run - Complete Flow

```
1. XAMPP Control Panel
   └─> Start MySQL (green)
       └─> Click Admin
           └─> Opens phpMyAdmin
               └─> Create database 'expense_tracker'
                   └─> Run SQL (create tables)
                       └─> Verify in Structure tab

2. Project Folder
   └─> Open .env file
       └─> Set DB_PASSWORD= (empty)
           └─> Save file
               └─> Open Command Prompt
                   └─> cd to project folder
                       └─> npm install
                           └─> npm start
                               └─> See "Database connected"

3. Browser
   └─> http://localhost:3000
       └─> Click Sign Up
           └─> Create account
               └─> Redirected to Dashboard
                   └─> Add expense
                       └─> SUCCESS! 🎉
```

---

## 💡 Tips for XAMPP Users

### Tip 1: Keep XAMPP Running
- While developing, keep XAMPP Control Panel open
- Keep MySQL running (green status)
- Don't close it or your app will lose database connection

### Tip 2: Use phpMyAdmin to Debug
- See all users: Browse `users` table
- See all expenses: Browse `expenses` table
- Delete test data: Select rows → Delete
- Run custom queries in SQL tab

### Tip 3: Restart if Issues
1. Stop the app (Ctrl+C in Command Prompt)
2. Stop MySQL in XAMPP
3. Start MySQL in XAMPP
4. Start the app (`npm start`)

---

**You're all set for XAMPP! Enjoy your Expense Tracker! 💰**

For more help, see:
- `README.md` - Full documentation
- `QUICKSTART.md` - General setup
- `XAMPP-SETUP.md` - XAMPP-specific details
