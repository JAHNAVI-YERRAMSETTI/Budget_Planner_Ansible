import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Expense = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [expenseDate, setExpenseDate] = useState('')

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setExpenseDate(today);
  }, []);

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Get user data and check ID
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.userId || user.user_id;
        const token = localStorage.getItem('token') || '';
        
        if (!userId) {
          setError('User not logged in properly. Please login again.');
          return;
        }
        
        // Load expenses for user
        const expensesResponse = await fetch(`${config.url}/expenses/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (!expensesResponse.ok) throw new Error(`HTTP ${expensesResponse.status}`)
        const expensesData = await expensesResponse.json()
        if (mounted) setExpenses(expensesData)

        // Load categories
        const categoriesResponse = await fetch(`${config.url}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (mounted) setCategories(categoriesData)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const addExpense = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Get user data and check ID
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      if (!userId) {
        setError('User not logged in properly. Please login again.');
        return;
      }
      
      const response = await fetch(`${config.url}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          amount: Number(amount), 
          description: description,
          category: { id: Number(categoryId) },
          expenseDate: expenseDate,
          user: { id: userId }
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add expense result:', result)
      setSuccessMessage('Expense added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload expenses
      const expensesResponse = await fetch(`${config.url}/expenses/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json()
        setExpenses(expensesData)
      }
      
      // Reset form
      setAmount('')
      setDescription('')
      setCategoryId('')
      setExpenseDate('')
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateExpense = async (expense) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/expenses/${expense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(expense)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update expense result:', result)
      
      // Reload expenses
      const expensesResponse = await fetch(`${config.url}/expenses/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json()
        setExpenses(expensesData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteExpense = async (expenseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete expense result:', result)
      
      // Reload expenses
      const expensesResponse = await fetch(`${config.url}/expenses/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json()
        setExpenses(expensesData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    localStorage.removeItem('token')
    navigate('/user/login')
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

  // Debug: Show localStorage data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Expenses</h2>
        
        
        <form onSubmit={addExpense} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Expense</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Amount" 
              required 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <select 
              required 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input 
              type="date" 
              required 
              value={expenseDate} 
              onChange={(e) => setExpenseDate(e.target.value)} 
            />
            <button type="submit">Add Expense</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={expense.amount} 
                    onChange={(e) => {
                      const updatedExpense = { ...expense, amount: Number(e.target.value) }
                      updateExpense(updatedExpense)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={expense.description || ''} 
                    onChange={(e) => {
                      const updatedExpense = { ...expense, description: e.target.value }
                      updateExpense(updatedExpense)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <select 
                    value={expense.category?.id || ''} 
                    onChange={(e) => {
                      const selectedCategory = categories.find(cat => cat.id === Number(e.target.value))
                      const updatedExpense = { ...expense, category: selectedCategory }
                      updateExpense(updatedExpense)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input 
                    type="date" 
                    value={expense.expenseDate || ''} 
                    onChange={(e) => {
                      const updatedExpense = { ...expense, expenseDate: e.target.value }
                      updateExpense(updatedExpense)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>Total Expenses: ${totalExpenses.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default Expense
