"use strict";

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amountIncome = document.getElementById('amount-income');
const amountExpense = document.getElementById('amount-expense');
const category = document.getElementById('category');
const date = document.getElementById('date');
const expenseBarChartElement = document.getElementById('expense-bar-chart');
const expensePieChartElement = document.getElementById('expense-pie-chart');

let expenseBarChart;
let expensePieChart;

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

/**
 * Generates a unique ID for the transaction.
 * @returns number representing a unique ID
 */
function generateID() {
  return new Date().getTime();
}

/**
 * Adds the new transaction
 * @param {Event} e event when user presses submit button 'Add Transaction'
 */
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || (amountIncome.value.trim() === '' && amountExpense.value.trim() === '') || category.value.trim() === '' || date.value.trim() === '') {
    alert('Please add a Transaction Name, Amount, Category, and Date');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: amountIncome.value.trim() !== '' ? +amountIncome.value : -amountExpense.value,
      category: category.value,
      date: date.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    updateCharts();
    text.value = '';
    amountIncome.value = '';
    amountExpense.value = '';
    category.value = '';
    date.value = '';
  }
}

/**
 * Adds the transaction to the DOM
 * @param {*} transaction the amount of transaction (e.g., 20 or -10)
 */
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `${transaction.text} (${transaction.category}) <span>${sign}${Math.abs(transaction.amount)}</span> 
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
                    <small>${transaction.date}</small>`;
  list.appendChild(item);
}

/**
 * Update the budget by calculating the balance, income, and expenses.
 */
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, val) => (acc += val), 0).toFixed(2);
  const income = amounts.filter(transaction => transaction > 0)
                        .reduce((acc, val) => (acc += val), 0)
                        .toFixed(2);
  const expense = amounts.filter(transaction => transaction < 0)
                         .reduce((acc, val) => (acc += val), 0)
                         .toFixed(2);

  balance.innerHTML = `Rs.${total}`;
  money_plus.innerHTML = `+Rs.${income}`;
  money_minus.innerHTML = `-Rs.${expense}`;
}

/**
 * Remove transaction by its ID from the DOM.
 * @param {number} id the unique id of the transaction
 */
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

/**
 * Updates the localStorage on the user's browser with new transactions
 */
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

/**
 * Initializes the app with seed data (found in user's localStorage).
 */
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
  initCharts();
  updateCharts();
}

/**
 * Initializes the Chart.js charts for weekly expenses and category breakdown
 */
function initCharts() {
  expenseBarChart = new Chart(expenseBarChartElement, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Weekly Expenses',
        data: [],
        backgroundColor: []
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  expensePieChart = new Chart(expensePieChartElement, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    }
  });
}

/**
 * Updates the Chart.js charts with current expense data
 */
function updateCharts() {
  const currentWeekTransactions = getTransactionsForCurrentWeek();
  const categories = [...new Set(currentWeekTransactions.map(t => t.category))];
  const expenseData = categories.map(category => {
    return currentWeekTransactions
      .filter(t => t.category === category && t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  });

  const incomeData = categories.map(category => {
    return currentWeekTransactions
      .filter(t => t.category === category && t.amount > 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  });

  const categoryColors = categories.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);

  // Update Bar Chart
  expenseBarChart.data.labels = categories;
  expenseBarChart.data.datasets[0].data = expenseData;
  expenseBarChart.data.datasets[0].backgroundColor = categoryColors;
  expenseBarChart.update();

  // Update Pie Chart
  expensePieChart.data.labels = categories;
  expensePieChart.data.datasets[0].data = expenseData;
  expensePieChart.data.datasets[0].backgroundColor = categoryColors;
  expensePieChart.update();
}

/**
 * Get transactions for the current week.
 * @returns {Array} transactions of the current week
 */
function getTransactionsForCurrentWeek() {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startOfWeek && transactionDate <= new Date();
  });
}

// Initialize the app
init();

/* Event Listeners */
form.addEventListener('submit', addTransaction);
"use strict";

"use strict";

// Existing code...

// Login Popup Elements
const loginPopup = document.getElementById('login-popup');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const popupTitle = document.getElementById('popup-title');
const closeLoginButton = document.getElementById('close-login');
const loginToggle = document.getElementById('login-toggle');
const registerToggle = document.getElementById('register-toggle');

// Show Login Popup
function showLoginPopup() {
  loginPopup.style.display = 'flex';
}

// Close Login Popup
function closeLoginPopup() {
  loginPopup.style.display = 'none';
}

// Handle Login Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      alert('Login successful');
      closeLoginPopup();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
});

// Handle Register Form Submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      alert('Registration successful. You can now log in.');
      toggleToLogin();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
});

// Toggle to Register Form
registerToggle.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  popupTitle.textContent = 'Register';
});

// Toggle to Login Form
loginToggle.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
  popupTitle.textContent = 'Login';
});

// Close Popup Button
closeLoginButton.addEventListener('click', closeLoginPopup);

// Example of how to trigger the popup (e.g., on page load or a button click)
window.onload = function() {
  // Optionally, show login popup on page load
  showLoginPopup();
};
