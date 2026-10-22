<div align="center">

# 💸 Expense Tracker

### Your money. Your month. Your clarity.

**A clean, full-stack expense tracker for recording spending, exploring monthly patterns, and exporting your data.**

<br>

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/Views-EJS-A91E50?style=for-the-badge)

<br>

| 🔐 Private accounts | 📅 Monthly insights | 📊 Visual breakdowns | 📥 CSV export |
|:---:|:---:|:---:|:---:|

</div>

---

## ✨ What you can do

- **Track expenses** — create, edit, and delete transactions.
- **See the month clearly** — navigate by month and year to review monthly totals and activity.
- **Understand spending** — explore category totals and an interactive chart.
- **Find transactions fast** — search and filter by category or date range.
- **Take your data with you** — export expense records to CSV.
- **Make it yours** — switch between light and dark themes.
- **Keep accounts separate** — sign up and log in with passwords hashed using bcrypt.

### Expense categories

`Home` · `Food` · `College` · `Travel` · `Other`

---

## 🧰 Built with

| Layer | Tools |
|---|---|
| App server | Node.js, Express |
| UI | EJS, HTML, CSS, browser JavaScript |
| Charts | Chart.js |
| Database | MySQL / XAMPP MariaDB |
| Authentication | express-session, bcrypt |
| Configuration | dotenv |

---

## 🚀 Get started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) and npm
- MySQL, or XAMPP with its **MySQL** service enabled
- Git (optional)

> **Note:** This project is served by Node.js/Express. Apache is not needed to run the application.

### 2. Get the project and install packages

```bash
git clone <your-repository-url>
cd expense-tracker
npm install
```

If you already have the project files, open a terminal in the project folder and run `npm install`.

### 3. Create the database

Start MySQL in XAMPP, then run the included schema:

```bash
mysql -u root -p < database_schema.sql
```

Enter the MySQL password when prompted. If your local XAMPP `root` account has no password, press Enter.

Alternatively, open `database_schema.sql` in phpMyAdmin at `http://localhost/phpmyadmin` and execute it. It creates the `expense_tracker` database and the required tables.

### 4. Add local configuration

Create a `.env` file in the project root, beside `server.js`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=expense_tracker
PORT=3000
SESSION_SECRET=put_a_long_random_secret_here
```

- Set `DB_PASSWORD` to your MySQL password. Keep it blank only if your local MySQL account has no password.
- Change `DB_PORT` if MySQL is running on a different port.
- Replace `SESSION_SECRET` with a long, private random value.
- **Never commit your `.env` file or real passwords to GitHub.**

### 5. Run it

```bash
npm start
```

For auto-restart while developing:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. If you changed `PORT`, use that port instead.

---

## 🗺️ How the app fits together

```text
Browser
  │
  ├── EJS pages + CSS + JavaScript
  │
  ▼
Node.js + Express ─── Session-based login
  │
  ├── Authentication and expense routes
  ├── Dashboard data and CSV export
  ▼
MySQL database
  ├── users
  └── expenses
```

---

## 📖 Using the app

1. Open the app and create an account.
2. Add expenses from the dashboard or the expenses page.
3. Use the month controls to view a particular month.
4. Review the chart and category breakdown.
5. Search or filter transactions on the expenses page.
6. Export your expense data as a CSV file.

---

## 🔌 Routes at a glance

| Method | Route | Purpose | Login required |
|---|---|---|:---:|
| `GET` | `/` | Redirect to login or dashboard | No |
| `GET` | `/signup` | Signup page | No |
| `POST` | `/signup` | Create an account | No |
| `GET` | `/login` | Login page | No |
| `POST` | `/login` | Authenticate | No |
| `GET` | `/logout` | End the session | No |
| `GET` | `/dashboard` | Dashboard page | Yes |
| `GET` | `/expenses` | Expense management page | Yes |
| `GET` | `/api/expenses` | List expenses | Yes |
| `POST` | `/api/expenses` | Create an expense | Yes |
| `PUT` | `/api/expenses/:id` | Update an expense | Yes |
| `DELETE` | `/api/expenses/:id` | Delete an expense | Yes |
| `GET` | `/api/dashboard-data` | Dashboard statistics | Yes |
| `GET` | `/api/expenses/download/csv` | Download CSV | Yes |

---

## 📂 Project structure

```text
expense-tracker/
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   └── auth.js              # Authentication guards
├── public/
│   ├── css/                 # App styles
│   └── js/                  # Dashboard and expense interactions
├── routes/
│   ├── auth.js              # Signup, login, logout
│   └── expenses.js          # Expense and dashboard APIs
├── views/                   # EJS pages
├── database_schema.sql      # Database and table definitions
├── server.js                # Express entry point
└── package.json             # Scripts and dependencies
```

---

## 🧯 Troubleshooting

| Message / symptom | What to check |
|---|---|
| `Access denied for user 'root'@'localhost'` | Make sure `DB_USER` and `DB_PASSWORD` match the MySQL server running in XAMPP. |
| `ECONNREFUSED` or database connection failed | Start MySQL and confirm `DB_HOST` and `DB_PORT` in `.env`. |
| `Unknown database 'expense_tracker'` | Run `database_schema.sql` against the configured MySQL server. |
| `Table doesn't exist` | Re-run `database_schema.sql` to create the tables. |
| `secret option required for sessions` | Add a non-empty `SESSION_SECRET` to `.env`, then restart Node.js. |
| Browser shows `POST /login 500` | Check the terminal running `npm start`; it prints the underlying error. |
| `Port 3000 is already in use` | Set a different `PORT` in `.env`, then restart the app. |

For a detailed XAMPP connection walkthrough, see [CONNECTION-SETUP.md](./CONNECTION-SETUP.md).

---

## 🔒 Security notes

- Keep `.env` out of source control; use a separate `.env.example` with placeholders if documenting configuration.
- Use a unique, private `SESSION_SECRET`.
- Use a dedicated MySQL account with only the permissions the app needs when deploying beyond local development.
- The default Express in-memory session store is intended for development; configure a persistent session store before production deployment.
- Use HTTPS and appropriate security controls before exposing the application publicly.

---

## 📄 License

This project is an educational Web Programming Lab project. See the repository for licensing details.

<div align="center">

**Made to make monthly spending easier to see.** 💜

</div>
