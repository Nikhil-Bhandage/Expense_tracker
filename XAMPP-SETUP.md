# 🔧 XAMPP Setup Guide for Expense Tracker

This guide will help you run the Expense Tracker using XAMPP's MySQL.

## 📋 Prerequisites

1. ✅ **XAMPP** installed (includes MySQL/MariaDB)
   - Download from: https://www.apachefriends.org/
   
2. ✅ **Node.js** installed
   - Download from: https://nodejs.org/

## 🚀 Step-by-Step Setup with XAMPP

### Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **MySQL** (or MariaDB) by clicking "Start"
3. Wait until it shows "Running" status

![XAMPP Control Panel - Start MySQL]

### Step 2: Create Database Using phpMyAdmin

**Option A: Using phpMyAdmin (Recommended for XAMPP)**

1. Click **"Admin"** button next to MySQL in XAMPP Control Panel
   - OR go to: `http://localhost/phpmyadmin`

2. Click **"New"** in the left sidebar

3. Create database:
   - Database name: `expense_tracker`
   - Collation: `utf8mb4_general_ci`
   - Click **"Create"**

4. Click on `expense_tracker` database in the left sidebar

5. Click **"SQL"** tab at the top

6. Copy and paste this SQL code:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create expenses table
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

7. Click **"Go"** button

8. You should see success message: "2 rows affected"

9. Verify: Click **"Structure"** tab - you should see both tables

**Option B: Using MySQL Command Line (Alternative)**

1. Open XAMPP Control Panel
2. Click **"Shell"** button (opens command prompt)
3. Type:
```bash
mysql -u root -p
# Press Enter (default: no password, just press Enter again)

CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

# Then paste the SQL code from above
```

### Step 3: Configure .env File for XAMPP

Open the `.env` file in your project and update:

```env
# XAMPP Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=                    # ⚠️ Leave EMPTY if no password set
DB_NAME=expense_tracker

# Server Configuration  
PORT=3000

# Session Secret
SESSION_SECRET=your_random_secret_key_here
```

**Important Notes for XAMPP:**
- Default XAMPP MySQL username: `root`
- Default XAMPP MySQL password: **EMPTY** (no password)
- If you set a password in XAMPP, enter it in `DB_PASSWORD`

### Step 4: Install Node.js Dependencies

Open **Command Prompt** or **Terminal** in your project folder:

```bash
# Navigate to project folder
cd C:\path\to\expense-tracker

# Install dependencies
npm install
```

### Step 5: Start the Application

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   💰 Expense Tracker Server Running       ║
║   🌐 URL: http://localhost:3000           ║
╚════════════════════════════════════════════╝
✅ Database connected successfully
```

### Step 6: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 🔍 Verifying Database Connection

### Check if Tables Were Created:

1. Go to phpMyAdmin: `http://localhost/phpmyadmin`
2. Click `expense_tracker` database
3. You should see 2 tables:
   - ✅ `users`
   - ✅ `expenses`

### Test Database Connection:

After starting the server, you should see:
```
✅ Database connected successfully
```

If you see this, everything is working!

## 🐛 Common XAMPP Issues & Fixes

### Issue 1: "Access denied for user 'root'@'localhost'"

**Cause:** Wrong password in `.env` file

**Fix:**
1. Open XAMPP Control Panel
2. Check if you set a MySQL password
3. Update `.env` file:
   ```env
   # If NO password (default XAMPP)
   DB_PASSWORD=
   
   # If you SET a password
   DB_PASSWORD=your_password_here
   ```

### Issue 2: "Database 'expense_tracker' doesn't exist"

**Fix:**
1. Go to phpMyAdmin
2. Create the database manually:
   - Click "New"
   - Name: `expense_tracker`
   - Click "Create"
3. Then run the SQL from Step 2

### Issue 3: "MySQL service won't start in XAMPP"

**Fix:**
1. Port 3306 might be in use
2. In XAMPP Control Panel, click "Config" next to MySQL
3. Change port to 3307
4. Update `.env`:
   ```env
   DB_HOST=localhost:3307
   ```
5. Restart MySQL in XAMPP

### Issue 4: "Can't connect to MySQL server"

**Fix:**
1. Make sure MySQL is RUNNING in XAMPP Control Panel
2. Try using `127.0.0.1` instead of `localhost`:
   ```env
   DB_HOST=127.0.0.1
   ```

### Issue 5: Port 3000 already in use

**Fix:** XAMPP Apache might be using port 3000
```env
# Change in .env file
PORT=3001
```
Then access: `http://localhost:3001`

## 📊 XAMPP Project Structure

```
C:\xampp\
├── mysql\              # MySQL installation
└── htdocs\            # (Optional: You can put project here)

Your Project:
C:\Users\YourName\expense-tracker\
├── All project files...
```

**Note:** You DON'T need to put the project in `htdocs` folder. This is a Node.js app, not PHP!

## ✅ XAMPP Advantages

- ✅ phpMyAdmin for easy database management
- ✅ No command-line MySQL needed
- ✅ Visual interface for everything
- ✅ Easy to backup database
- ✅ Default no password (easy for development)

## 🎯 Quick Start Commands for XAMPP Users

```bash
# 1. Start XAMPP MySQL service (via Control Panel)

# 2. Create database in phpMyAdmin (web interface)

# 3. Install dependencies
npm install

# 4. Update .env with XAMPP settings (root, no password)

# 5. Start the app
npm start

# 6. Open browser
http://localhost:3000
```

## 🔐 Security Notes for XAMPP

⚠️ **For Development Only:**
- Default XAMPP has no MySQL password (not secure for production)
- Only use for local development/testing
- Don't expose to the internet

**For Production:**
1. Set a strong MySQL password
2. Update `.env` with the password
3. Use proper hosting (not XAMPP)

## 📱 Testing the App with XAMPP

1. **Start XAMPP** → Start MySQL
2. **Create Database** → Use phpMyAdmin
3. **Run App** → `npm start`
4. **Test:**
   - Sign up: Create account
   - Login: Use credentials
   - Add expense: Test functionality
   - Check Database: See data in phpMyAdmin

## 💡 Pro Tips for XAMPP Users

### Tip 1: View Data in phpMyAdmin
After adding expenses in the app:
1. Go to phpMyAdmin
2. Click `expense_tracker` → `expenses` table
3. Click "Browse" to see all your expenses
4. You can edit/delete directly from phpMyAdmin

### Tip 2: Backup Database
1. phpMyAdmin → `expense_tracker`
2. Click "Export"
3. Choose "Quick" export
4. Click "Go"
5. Save the `.sql` file

### Tip 3: Import Database
1. phpMyAdmin → `expense_tracker`
2. Click "Import"
3. Choose your `.sql` file
4. Click "Go"

### Tip 4: Monitor Queries
Enable query logging in XAMPP:
1. Config → my.ini
2. Add: `general_log = 1`
3. Restart MySQL

## 🆘 Need Help?

### XAMPP Not Working?
1. Restart XAMPP services
2. Check XAMPP error logs
3. Verify MySQL port (default: 3306)

### App Not Connecting?
1. Check `.env` credentials
2. Verify MySQL is running in XAMPP
3. Test connection in phpMyAdmin first

### Still Stuck?
1. Check Node.js console for errors
2. Check XAMPP Control Panel logs
3. Verify database exists in phpMyAdmin
4. Make sure both XAMPP MySQL and your app are running

---

## 🎓 Summary for XAMPP Users

**XAMPP Setup is EASIER because:**
- ✅ Visual interface (phpMyAdmin)
- ✅ No command-line needed
- ✅ Default settings work out-of-box
- ✅ Easy to see and manage data

**Just 3 things to remember:**
1. Start MySQL in XAMPP Control Panel
2. Use phpMyAdmin to create database
3. Leave password EMPTY in `.env` (default XAMPP)

**You're all set! Happy coding! 💰**
