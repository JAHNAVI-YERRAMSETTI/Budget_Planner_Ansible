import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Income = () => {
  const navigate = useNavigate()
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const [incomeDate, setIncomeDate] = useState('')
  const [description, setDescription] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setIncomeDate(today);
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
        
        const response = await fetch(`${config.url}/incomes/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setIncomes(data)
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const addIncome = async (e) => {
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
      
      const response = await fetch(`${config.url}/incomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          amount: Number(amount), 
          source, 
          date: incomeDate,
          description,
          isRecurring: isRecurring,
          user: { id: userId }
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add income result:', result)
      setSuccessMessage('Income added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload incomes
      const incomesResponse = await fetch(`${config.url}/incomes/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (incomesResponse.ok) {
        const incomesData = await incomesResponse.json()
        setIncomes(incomesData)
      }
      
      // Reset form
      setAmount('')
      setSource('')
      setIncomeDate('')
      setDescription('')
      setIsRecurring(false)
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateIncome = async (income) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/incomes/${income.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(income)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update income result:', result)
      
      // Reload incomes
      const incomesResponse = await fetch(`${config.url}/incomes/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (incomesResponse.ok) {
        const incomesData = await incomesResponse.json()
        setIncomes(incomesData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteIncome = async (incomeId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/incomes/${incomeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete income result:', result)
      
      // Reload incomes
      const incomesResponse = await fetch(`${config.url}/incomes/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (incomesResponse.ok) {
        const incomesData = await incomesResponse.json()
        setIncomes(incomesData)
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

  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0)

  // Debug: Show localStorage data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Income</h2>
        
        
        <form onSubmit={addIncome} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Income</h3>
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
              placeholder="Source" 
              required 
              value={source} 
              onChange={(e) => setSource(e.target.value)} 
            />
            <input 
              type="date" 
              required 
              value={incomeDate} 
              onChange={(e) => setIncomeDate(e.target.value)} 
            />
            <input 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <button type="submit">Add Income</button>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input 
                type="checkbox" 
                checked={isRecurring} 
                onChange={(e) => setIsRecurring(e.target.checked)} 
              />
              Monthly Recurring Income
            </label>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Source</th>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map(income => (
              <tr key={income.id}>
                <td>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={income.amount} 
                    onChange={(e) => {
                      const updatedIncome = { ...income, amount: Number(e.target.value) }
                      updateIncome(updatedIncome)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={income.source} 
                    onChange={(e) => {
                      const updatedIncome = { ...income, source: e.target.value }
                      updateIncome(updatedIncome)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="date" 
                    value={income.date || ''} 
                    onChange={(e) => {
                      const updatedIncome = { ...income, date: e.target.value }
                      updateIncome(updatedIncome)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={income.description || ''} 
                    onChange={(e) => {
                      const updatedIncome = { ...income, description: e.target.value }
                      updateIncome(updatedIncome)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <span style={{ 
                    color: income.isRecurring ? '#28a745' : '#6c757d',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {income.isRecurring ? 'Recurring' : 'One-time'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => deleteIncome(income.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>Total Income: ${totalIncome.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default Income
