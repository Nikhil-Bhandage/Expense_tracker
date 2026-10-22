// public/js/expenses.js
// Expenses page functionality - CRUD operations

// Global variables
let allExpenses = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Load expenses
    loadExpenses();

    // Set up forms
    const addForm = document.getElementById('addExpenseForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddExpense);
    }

    const editForm = document.getElementById('editExpenseForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditExpense);
    }

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

// Load all expenses
async function loadExpenses() {
    try {
        const response = await fetch('/api/expenses');
        const result = await response.json();

        if (result.success) {
            allExpenses = result.expenses;
            displayExpenses(allExpenses);
        } else {
            showNotification('Failed to load expenses', 'error');
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        showNotification('Error loading expenses', 'error');
    }
}

// Display expenses in table
function displayExpenses(expenses) {
    const tbody = document.getElementById('expensesTableBody');
    
    if (!tbody) return;

    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No expenses found</td></tr>';
        return;
    }

    let html = '';
    expenses.forEach(expense => {
        // Format date
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        html += `
            <tr>
                <td>${formattedDate}</td>
                <td>
                    <span class="category-badge category-${expense.category}">
                        ${expense.category}
                    </span>
                </td>
                <td>${expense.description || '-'}</td>
                <td><strong>₹${parseFloat(expense.amount).toFixed(2)}</strong></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="openEditModal(${expense.id})">
                            ✏️ Edit
                        </button>
                        <button class="btn-delete" onclick="deleteExpense(${expense.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Handle add expense
async function handleAddExpense(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description'),
        date: formData.get('date')
    };

    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Expense added successfully!', 'success');
            e.target.reset();
            
            // Set today's date again
            const dateInput = document.getElementById('date');
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;

            // Reload expenses
            loadExpenses();
        } else {
            showNotification(result.message || 'Failed to add expense', 'error');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showNotification('Error adding expense', 'error');
    }
}

// Open edit modal
function openEditModal(expenseId) {
    const expense = allExpenses.find(e => e.id === expenseId);
    
    if (!expense) {
        showNotification('Expense not found', 'error');
        return;
    }

    // Populate form
    document.getElementById('editExpenseId').value = expense.id;
    document.getElementById('editAmount').value = expense.amount;
    document.getElementById('editCategory').value = expense.category;
    document.getElementById('editDescription').value = expense.description || '';
    
    // Format date for input (YYYY-MM-DD)
    const date = new Date(expense.date);
    const formattedDate = date.toISOString().split('T')[0];
    document.getElementById('editDate').value = formattedDate;

    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle edit expense
async function handleEditExpense(e) {
    e.preventDefault();

    const expenseId = document.getElementById('editExpenseId').value;
    const formData = new FormData(e.target);
    const data = {
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description'),
        date: formData.get('date')
    };

    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Expense updated successfully!', 'success');
            closeEditModal();
            loadExpenses();
        } else {
            showNotification(result.message || 'Failed to update expense', 'error');
        }
    } catch (error) {
        console.error('Error updating expense:', error);
        showNotification('Error updating expense', 'error');
    }
}

// Delete expense
async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Expense deleted successfully!', 'success');
            loadExpenses();
        } else {
            showNotification(result.message || 'Failed to delete expense', 'error');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showNotification('Error deleting expense', 'error');
    }
}

// Filter expenses
function filterExpenses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFrom = document.getElementById('dateFromFilter').value;
    const dateTo = document.getElementById('dateToFilter').value;

    let filtered = allExpenses.filter(expense => {
        // Search filter
        const matchesSearch = !searchTerm || 
            expense.description.toLowerCase().includes(searchTerm) ||
            expense.category.toLowerCase().includes(searchTerm);

        // Category filter
        const matchesCategory = !categoryFilter || expense.category === categoryFilter;

        // Date range filter
        const expenseDate = new Date(expense.date);
        const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);

        return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });

    displayExpenses(filtered);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('dateFromFilter').value = '';
    document.getElementById('dateToFilter').value = '';
    displayExpenses(allExpenses);
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const themeBtn = document.querySelector('.btn-theme');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}
