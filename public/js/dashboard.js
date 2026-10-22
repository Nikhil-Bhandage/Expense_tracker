// public/js/dashboard.js
// Dashboard functionality - Monthly Chart and statistics

// Global variables
let categoryChart = null;
let currentMonth = new Date().getMonth() + 1; // 1-12
let currentYear = new Date().getFullYear();
let availableMonths = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Populate year dropdown with last 5 years and next year
    populateYearDropdown();
    
    // Set current month and year in dropdowns
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;

    // Set today's date as default in quick add form
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Load dashboard data for current month
    loadDashboardData();

    // Set up quick add form
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
        quickAddForm.addEventListener('submit', handleQuickAdd);
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

// Populate year dropdown
function populateYearDropdown() {
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();
    
    // Add years from 5 years ago to next year
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Load dashboard data for selected month
async function loadDashboardData() {
    try {
        const response = await fetch(`/api/dashboard-data?month=${currentMonth}&year=${currentYear}`);
        const result = await response.json();

        if (result.success) {
            availableMonths = result.data.availableMonths || [];
            updateStatistics(result.data);
            updateCategoryChart(result.data.categoryBreakdown);
            updateCategoryList(result.data.categoryBreakdown);
            updateMonthDisplay();
        } else {
            showNotification('Failed to load dashboard data', 'error');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Error loading dashboard', 'error');
    }
}

// Update month display in header
function updateMonthDisplay() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.querySelector('.page-header h1').textContent = 
        `Dashboard - ${monthNames[currentMonth - 1]} ${currentYear}`;
}

// Navigate to previous/next month
function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    
    // Update dropdowns
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;
    
    // Reload data
    loadDashboardData();
}

// Change month from dropdown
function changeMonth() {
    currentMonth = parseInt(document.getElementById('monthSelect').value);
    currentYear = parseInt(document.getElementById('yearSelect').value);
    loadDashboardData();
}

// Update statistics cards
function updateStatistics(data) {
    document.getElementById('totalExpense').textContent = `₹${data.totalExpense.toFixed(2)}`;
    document.getElementById('expenseCount').textContent = data.expenseCount;
    
    const avgExpense = data.expenseCount > 0 ? (data.totalExpense / data.expenseCount) : 0;
    document.getElementById('avgExpense').textContent = `₹${avgExpense.toFixed(2)}`;
    
    // Find top category
    if (data.categoryBreakdown && data.categoryBreakdown.length > 0) {
        const topCat = data.categoryBreakdown.reduce((max, cat) => 
            cat.total > max.total ? cat : max
        );
        document.getElementById('topCategory').textContent = topCat.category;
    } else {
        document.getElementById('topCategory').textContent = '-';
    }
}

// Update pie chart
function updateCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryPieChart');
    
    if (!ctx) return;

    // If no data, show message
    if (!categoryData || categoryData.length === 0) {
        ctx.parentElement.innerHTML = '<p class="no-data">No expenses for this month</p>';
        return;
    }

    // Restore canvas if it was replaced
    if (!(ctx instanceof HTMLCanvasElement)) {
        ctx.parentElement.innerHTML = '<canvas id="categoryPieChart"></canvas>';
        const newCtx = document.getElementById('categoryPieChart');
        updateCategoryChart(categoryData);
        return;
    }

    // Destroy existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }

    // Prepare data for chart
    const labels = categoryData.map(item => item.category);
    const amounts = categoryData.map(item => item.total);
    
    // Category colors
    const colors = {
        'Home': '#0ea5e9',
        'Food': '#f59e0b',
        'College': '#3b82f6',
        'Travel': '#ec4899',
        'Other': '#6b7280'
    };

    const backgroundColors = labels.map(label => colors[label] || '#6b7280');

    // Create chart
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update category list
function updateCategoryList(categoryData) {
    const categoryList = document.getElementById('categoryList');
    
    if (!categoryList) return;

    if (!categoryData || categoryData.length === 0) {
        categoryList.innerHTML = '<p class="no-data">No expenses for this month</p>';
        return;
    }

    // Category icons
    const icons = {
        'Home': '🏠',
        'Food': '🍔',
        'College': '🎓',
        'Travel': '✈️',
        'Other': '📦'
    };

    let html = '';
    
    // Sort by amount (highest first)
    const sortedData = [...categoryData].sort((a, b) => b.total - a.total);
    
    sortedData.forEach(item => {
        html += `
            <div class="category-item">
                <span class="category-name">
                    ${icons[item.category] || '📦'} ${item.category}
                </span>
                <span class="category-amount">₹${item.total.toFixed(2)}</span>
            </div>
        `;
    });

    categoryList.innerHTML = html;
}

// Handle quick add form submission
async function handleQuickAdd(e) {
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
            const dateInput = e.target.querySelector('input[name="date"]');
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;

            // Reload dashboard data
            loadDashboardData();
        } else {
            showNotification(result.message || 'Failed to add expense', 'error');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showNotification('Error adding expense', 'error');
    }
}

// Download CSV for current month
function downloadCSV() {
    const url = `/api/expenses/download/csv?month=${currentMonth}&year=${currentYear}`;
    window.location.href = url;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    showNotification(`Downloading ${monthNames[currentMonth-1]} ${currentYear} expenses...`, 'success');
}

// Toggle dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update button text
    const themeBtn = document.querySelector('.btn-theme');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
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
        max-width: 400px;
    `;
    notification.textContent = message;

    // Add animation styles
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

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
