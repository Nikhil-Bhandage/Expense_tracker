// routes/expenses.js
// Expense management routes - CRUD operations

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// GET - All expenses for logged-in user
router.get('/expenses', isAuthenticated, async (req, res) => {
    try {
        const [expenses] = await db.query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC',
            [req.session.userId]
        );

        res.json({ success: true, expenses });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch expenses' });
    }
});

// POST - Add new expense
router.post('/expenses', isAuthenticated, async (req, res) => {
    const { amount, category, description, date } = req.body;

    // Validation
    if (!amount || !category || !date) {
        return res.status(400).json({ 
            success: false, 
            message: 'Amount, category, and date are required' 
        });
    }

    if (amount <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Amount must be greater than 0' 
        });
    }

    const validCategories = ['Home', 'Food', 'College', 'Travel', 'Other'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid category' 
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO expenses (user_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)',
            [req.session.userId, amount, category, description || '', date]
        );

        res.json({ 
            success: true, 
            message: 'Expense added successfully',
            expenseId: result.insertId
        });
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ success: false, message: 'Failed to add expense' });
    }
});

// PUT - Update expense
router.put('/expenses/:id', isAuthenticated, async (req, res) => {
    const expenseId = req.params.id;
    const { amount, category, description, date } = req.body;

    // Validation
    if (!amount || !category || !date) {
        return res.status(400).json({ 
            success: false, 
            message: 'Amount, category, and date are required' 
        });
    }

    if (amount <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Amount must be greater than 0' 
        });
    }

    try {
        // Check if expense belongs to user
        const [expenses] = await db.query(
            'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
            [expenseId, req.session.userId]
        );

        if (expenses.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Expense not found' 
            });
        }

        // Update expense
        await db.query(
            'UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
            [amount, category, description || '', date, expenseId, req.session.userId]
        );

        res.json({ 
            success: true, 
            message: 'Expense updated successfully' 
        });
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ success: false, message: 'Failed to update expense' });
    }
});

// DELETE - Delete expense
router.delete('/expenses/:id', isAuthenticated, async (req, res) => {
    const expenseId = req.params.id;

    try {
        // Check if expense belongs to user
        const [expenses] = await db.query(
            'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
            [expenseId, req.session.userId]
        );

        if (expenses.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Expense not found' 
            });
        }

        // Delete expense
        await db.query(
            'DELETE FROM expenses WHERE id = ? AND user_id = ?',
            [expenseId, req.session.userId]
        );

        res.json({ 
            success: true, 
            message: 'Expense deleted successfully' 
        });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete expense' });
    }
});

// GET - Dashboard data (totals and category breakdown) - MONTHLY
router.get('/dashboard-data', isAuthenticated, async (req, res) => {
    try {
        // Get selected month and year from query params (default to current month)
        const selectedMonth = req.query.month || new Date().getMonth() + 1; // 1-12
        const selectedYear = req.query.year || new Date().getFullYear();

        // Get total expenses for selected month
        const [totalResult] = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM expenses 
             WHERE user_id = ? 
             AND MONTH(date) = ? 
             AND YEAR(date) = ?`,
            [req.session.userId, selectedMonth, selectedYear]
        );

        // Get category-wise totals for selected month
        const [categoryTotals] = await db.query(
            `SELECT category, COALESCE(SUM(amount), 0) as total 
             FROM expenses 
             WHERE user_id = ? 
             AND MONTH(date) = ? 
             AND YEAR(date) = ?
             GROUP BY category`,
            [req.session.userId, selectedMonth, selectedYear]
        );

        // Get expense count for selected month
        const [countResult] = await db.query(
            `SELECT COUNT(*) as count 
             FROM expenses 
             WHERE user_id = ? 
             AND MONTH(date) = ? 
             AND YEAR(date) = ?`,
            [req.session.userId, selectedMonth, selectedYear]
        );

        // Get all available months with expenses for navigation
        const [availableMonths] = await db.query(
            `SELECT DISTINCT 
                YEAR(date) as year, 
                MONTH(date) as month,
                DATE_FORMAT(date, '%Y-%m') as yearMonth
             FROM expenses 
             WHERE user_id = ?
             ORDER BY year DESC, month DESC`,
            [req.session.userId]
        );

        res.json({
            success: true,
            data: {
                totalExpense: parseFloat(totalResult[0].total),
                expenseCount: countResult[0].count,
                categoryBreakdown: categoryTotals.map(item => ({
                    category: item.category,
                    total: parseFloat(item.total)
                })),
                selectedMonth: parseInt(selectedMonth),
                selectedYear: parseInt(selectedYear),
                availableMonths: availableMonths.map(item => ({
                    year: item.year,
                    month: item.month,
                    yearMonth: item.yearMonth
                }))
            }
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
});

// GET - Download expenses as CSV (with monthly filter)
router.get('/expenses/download/csv', isAuthenticated, async (req, res) => {
    try {
        const month = req.query.month;
        const year = req.query.year;

        let query = 'SELECT amount, category, description, date FROM expenses WHERE user_id = ?';
        let params = [req.session.userId];

        // Add monthly filter if provided
        if (month && year) {
            query += ' AND MONTH(date) = ? AND YEAR(date) = ?';
            params.push(month, year);
        }

        query += ' ORDER BY date DESC';

        const [expenses] = await db.query(query, params);

        // Create CSV content
        let csv = 'Date,Category,Amount,Description\n';
        expenses.forEach(expense => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            csv += `${date},${expense.category},${expense.amount},"${expense.description || ''}"\n`;
        });

        // Set filename with month/year if filtered
        let filename = 'expenses';
        if (month && year) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            filename = `expenses_${monthNames[month-1]}_${year}`;
        }

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        res.send(csv);
    } catch (error) {
        console.error('CSV download error:', error);
        res.status(500).send('Failed to download CSV');
    }
});

module.exports = router;
