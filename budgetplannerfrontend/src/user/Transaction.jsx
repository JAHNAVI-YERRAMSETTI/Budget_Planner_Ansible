import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Transaction = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [retailers, setRetailers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [retailer, setRetailer] = useState('')
  const [description, setDescription] = useState('')
  const [isPaymentAppImport, setIsPaymentAppImport] = useState(false)
  const [suggestedCategory, setSuggestedCategory] = useState('')
  const [isUserConfirmedCategory, setIsUserConfirmedCategory] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Load transactions for user
        const transactionsResponse = await fetch(`${config.url}/transactions/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          if (mounted) setTransactions(transactionsData)
        }

        // Load categories
        const categoriesResponse = await fetch(`${config.url}/categories`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (mounted) setCategories(categoriesData)
        }

        // Load retailers
        const retailersResponse = await fetch(`${config.url}/retailers`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (retailersResponse.ok) {
          const retailersData = await retailersResponse.json()
          if (mounted) setRetailers(retailersData)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user.id])

  const addTransaction = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${config.url}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount: Number(amount), 
          date: date,
          retailer,
          description,
          isPaymentAppImport,
          category: suggestedCategory ? { name: suggestedCategory } : null,
          userConfirmedCategory: isUserConfirmedCategory,
          user: { id: user.id }
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add transaction result:', result)
      setSuccessMessage('Transaction added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload transactions
      const transactionsResponse = await fetch(`${config.url}/transactions`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      }
      
      // Reset form
      setAmount('')
      setDate('')
      setRetailer('')
      setDescription('')
      setIsPaymentAppImport(false)
      setSuggestedCategory('')
      setIsUserConfirmedCategory(false)
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateTransaction = async (transaction) => {
    try {
      const response = await fetch(`${config.url}/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update transaction result:', result)
      
      // Reload transactions
      const transactionsResponse = await fetch(`${config.url}/transactions`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`${config.url}/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete transaction result:', result)
      
      // Reload transactions
      const transactionsResponse = await fetch(`${config.url}/transactions`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const totalTransactions = transactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)
  const paymentAppImports = transactions.filter(t => t.isPaymentAppImport).length

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Transactions</h2>
        
        <form onSubmit={addTransaction} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Transaction</h3>
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
              type="date" 
              required 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
            <input 
              placeholder="Retailer" 
              value={retailer} 
              onChange={(e) => setRetailer(e.target.value)} 
            />
            <input 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <select 
              value={suggestedCategory} 
              onChange={(e) => setSuggestedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, alignItems: 'center' }}>
            <button type="submit">Add Transaction</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={isPaymentAppImport} 
                onChange={(e) => setIsPaymentAppImport(e.target.checked)} 
              />
              Payment App Import
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={isUserConfirmedCategory} 
                onChange={(e) => setIsUserConfirmedCategory(e.target.checked)} 
              />
              User Confirmed Category
            </label>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <div style={{ padding: 8, backgroundColor: '#e3f2fd', borderRadius: 4 }}>
            <strong>Total Transactions: {transactions.length}</strong>
          </div>
          <div style={{ padding: 8, backgroundColor: '#e8f5e8', borderRadius: 4 }}>
            <strong>Total Amount: ${totalTransactions.toFixed(2)}</strong>
          </div>
          <div style={{ padding: 8, backgroundColor: '#fff3e0', borderRadius: 4 }}>
            <strong>Payment App Imports: {paymentAppImports}</strong>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Retailer</th>
              <th>Category</th>
              <th>Suggested Category</th>
              <th>Type</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={transaction.amount} 
                    onChange={(e) => {
                      const updatedTransaction = { ...transaction, amount: Number(e.target.value) }
                      updateTransaction(updatedTransaction)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="date" 
                    value={transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : ''} 
                    onChange={(e) => {
                      const updatedTransaction = { ...transaction, date: new Date(e.target.value) }
                      updateTransaction(updatedTransaction)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={transaction.retailer || ''} 
                    onChange={(e) => {
                      const updatedTransaction = { ...transaction, retailer: e.target.value }
                      updateTransaction(updatedTransaction)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <select 
                    value={transaction.category?.id || ''} 
                    onChange={(e) => {
                      const updatedTransaction = { 
                        ...transaction, 
                        category: { id: Number(e.target.value) }
                      }
                      updateTransaction(updatedTransaction)
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
                  <span style={{ 
                    color: transaction.suggestedCategory ? '#1976d2' : '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    {transaction.suggestedCategory || 'None'}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: transaction.isPaymentAppImport ? '#ff9800' : '#4caf50',
                    fontWeight: 'bold'
                  }}>
                    {transaction.isPaymentAppImport ? 'Import' : 'Manual'}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: transaction.isUserConfirmedCategory ? '#4caf50' : '#f44336',
                    fontWeight: 'bold'
                  }}>
                    {transaction.isUserConfirmedCategory ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => deleteTransaction(transaction.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          <h3>Recent Payment App Imports</h3>
          {transactions.filter(t => t.isPaymentAppImport).slice(0, 5).map(transaction => (
            <div key={transaction.id} style={{ 
              padding: 8, 
              margin: '4px 0', 
              backgroundColor: '#fff3e0', 
              borderRadius: 4,
              border: '1px solid #ffb74d'
            }}>
              <strong>${transaction.amount}</strong> at {transaction.retailer} on {new Date(transaction.date).toLocaleDateString()}
              {transaction.suggestedCategory && (
                <span style={{ color: '#ff9800', marginLeft: 8 }}>
                  → Suggested: {transaction.suggestedCategory}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Transaction
