# 🚀 QUICK START GUIDE

Follow these simple steps to get your Expense Tracker running in 5 minutes!

## Step 1: Prerequisites Check ✅

Make sure you have installed:
- ✅ Node.js (v14 or higher) - `node --version`
- ✅ MySQL (v5.7 or higher) - `mysql --version`
- ✅ npm (comes with Node.js) - `npm --version`

If not installed, download from:
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/

## Step 2: Install Dependencies 📦

Open terminal/command prompt in the project folder and run:

```bash
npm install
```

Wait for all packages to install (~2 minutes).

## Step 3: Setup Database 💾

### Option A: Using MySQL Command Line

```bash
# 1. Login to MySQL
mysql -u root -p
# Enter your MySQL password

# 2. Copy and paste these commands:
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

# 3. Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 4. Create expenses table
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

# 5. Verify
SHOW TABLES;
# You should see 'users' and 'expenses' tables

# 6. Exit
exit;
```

### Option B: Using SQL File

```bash
mysql -u root -p < database_schema.sql
```

## Step 4: Configure Environment ⚙️

Open the `.env` file and update:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here    # ⚠️ CHANGE THIS
DB_NAME=expense_tracker
PORT=3000
SESSION_SECRET=change_this_to_random_string    # ⚠️ CHANGE THIS
```

**Important:** Replace with your actual MySQL password!

## Step 5: Start the Server 🎯

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

## Step 6: Open in Browser 🌐

Open your browser and go to:
```
http://localhost:3000
```

## Step 7: Create Account 👤

1. Click "Sign Up"
2. Enter:
   - Username (min 3 characters)
   - Email
   - Password (min 6 characters)
3. Click "Sign Up"
4. You're in! 🎉

## Common Issues & Quick Fixes 🔧

### ❌ "Cannot connect to database"
**Fix:** 
- Check if MySQL is running
- Verify password in `.env` file
- Make sure database exists: `mysql -u root -p` → `SHOW DATABASES;`

### ❌ "Port 3000 already in use"
**Fix:** Change PORT in `.env` to 3001, 3002, etc.

### ❌ "Module not found"
**Fix:** Run `npm install` again

### ❌ "Table doesn't exist"
**Fix:** Run the database setup commands again (Step 3)

## Development Mode (Auto-restart) 🔄

For development, use:
```bash
npm run dev
```

This will auto-restart the server when you make changes.

## Testing the App 🧪

1. **Sign Up** → Create a new account
2. **Login** → Login with your credentials
3. **Add Expense** → Add a test expense from dashboard
4. **View Dashboard** → See your expense in the pie chart
5. **Edit/Delete** → Go to Expenses page and try editing

## Project Features ✨

✅ User Authentication (Signup/Login)
✅ Add/Edit/Delete Expenses
✅ Dashboard with Charts
✅ Category-wise Breakdown
✅ Filter & Search
✅ Download CSV
✅ Dark Mode
✅ Responsive Design

## Need Help? 🆘

1. Check README.md for detailed documentation
2. Review error messages in the terminal
3. Make sure all prerequisites are installed
4. Verify MySQL credentials in .env

## File Structure 📁

```
expense-tracker/
├── config/          # Database config
├── middleware/      # Authentication
├── public/          # CSS & JavaScript
├── routes/          # API routes
├── views/           # HTML templates
├── .env            # ⚠️ Configure this!
├── server.js       # Main server
└── database_schema.sql  # Database setup
```

## What's Next? 🚀

After setup, you can:
1. Customize categories in `database_schema.sql`
2. Modify styles in `public/css/`
3. Add new features in `routes/`
4. Change UI in `views/`

## Security Notes 🔒

⚠️ Before deploying:
1. Change SESSION_SECRET to a strong random string
2. Use strong MySQL password
3. Never commit .env file to Git
4. Keep dependencies updated: `npm update`

---

**You're all set! Start tracking your expenses! 💰**

For detailed documentation, see README.md
