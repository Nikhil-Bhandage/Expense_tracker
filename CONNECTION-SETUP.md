# Connecting the Expense Tracker to XAMPP MySQL

This application uses **Node.js and Express** for its web server and **MySQL** for its database. XAMPP can provide the MySQL service (called **MySQL** or **MariaDB** in the XAMPP Control Panel). Apache is not required to run this Node.js application.

## Requirements

- Node.js and npm
- XAMPP, with its MySQL service available
- The project dependencies installed with `npm install`

## 1. Start MySQL in XAMPP

Open the XAMPP Control Panel and start **MySQL**. Apache is optional; the app is served by Node.js, not Apache.

If MySQL uses a port other than the default `3306`, note the port so it can be configured below.

## 2. Create the database and tables

Open phpMyAdmin at `http://localhost/phpmyadmin`, or use the MySQL command line to run the project's [`database_schema.sql`](./database_schema.sql) file. The schema creates the `expense_tracker` database and its `users` and `expenses` tables.

For example, from a terminal where the MySQL command-line client is available:

```bash
mysql -u root -p < database_schema.sql
```

If your MySQL root account has no password, press Enter when prompted. If it has a password, enter that password.

## 3. Configure environment variables

Create a `.env` file in the project root, next to `server.js`, with values for your local MySQL installation:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=expense_tracker
PORT=3000
SESSION_SECRET=replace_with_a_long_random_secret
```

- Set `DB_PASSWORD` to the password for your MySQL account. The default XAMPP `root` account often has no password, in which case leave it empty.
- If MySQL is listening on a non-default port, set `DB_PORT` to that port.
- Set `SESSION_SECRET` to a long, private random value. Do not publish it.
- Do not commit `.env` to GitHub. Commit a `.env.example` with placeholder values instead, if you want to show the required variable names.

## 4. Start the application

From the project root, run:

```bash
npm start
```

Then open `http://localhost:3000` in your browser. Keep the terminal open while using the app; it displays startup and error messages.

## Troubleshooting

### `Access denied for user 'root'@'localhost'`

The app reached MySQL, but the username or password was rejected. Check `DB_USER` and `DB_PASSWORD` in `.env` against the credentials for the MySQL service that is running, then restart the Node.js app.

### `Database connection failed` / `ECONNREFUSED`

Check that MySQL is running in XAMPP, and verify `DB_HOST` and `DB_PORT`. If MySQL is not using port `3306`, set `DB_PORT` to its actual port.

### `Unknown database 'expense_tracker'`

Create the database by running `database_schema.sql` against the same MySQL server configured in `.env`.

### `Table doesn't exist`

Run `database_schema.sql` to create the `users` and `expenses` tables in `expense_tracker`.

### `secret option required for sessions`

The app did not receive a `SESSION_SECRET`. Add a non-empty `SESSION_SECRET` to `.env`, save the file, and restart the server.

### Browser shows `POST /login 500`

A 500 response is a symptom, not the underlying cause. Check the terminal running `npm start` for the error details. If the message mentions the session secret, follow the previous step; if it mentions access denied, check the MySQL credentials.
