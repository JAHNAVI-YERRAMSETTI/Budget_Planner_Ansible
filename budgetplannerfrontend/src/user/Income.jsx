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

  // Helper to format date for input (yyyy-MM-dd from backend)
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    // Convert dd-MM-yyyy to yyyy-MM-dd if needed (based on screenshot)
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // e.g., "22-09-2025" → "2025-09-22"
    }
    return dateStr; // Already yyyy-MM-dd
  };

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
        console.log('Loaded incomes:', data) // Debug: Check data structure
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
          description: description || null,
          isRecurring,
          user: { id: userId }
        })
      })
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }
      const result = await response.json()
      console.log('Add income result:', result)
      setSuccessMessage('Income added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload incomes
      await loadIncomes(userId, token)
      
      // Reset form
      setAmount('')
      setSource('')
      setIncomeDate('')
      setDescription('')
      setIsRecurring(false)
    } catch (e) {
      console.error('Add error:', e)
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  // Helper to reload incomes
  const loadIncomes = async (userId, token) => {
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
  }

  const updateIncome = async (updatedIncome) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.userId || user.user_id;
      const token = localStorage.getItem('token') || '';
      
      // Prepare safe body with stubs
      const body = {
        id: updatedIncome.id,
        amount: Number(updatedIncome.amount),
        source: updatedIncome.source,
        date: updatedIncome.date,
        description: updatedIncome.description || null,
        isRecurring: updatedIncome.isRecurring,
        user: { id: userId }
      }
      console.log('PUT body:', body) // Debug

      const response = await fetch(`${config.url}/incomes/${updatedIncome.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }
      const result = await response.json()
      console.log('Update income result:', result)
      
      // Reload incomes
      await loadIncomes(userId, token)
    } catch (e) {
      console.error('Update error details:', e)
      setError(String(e.message || e))
    }
  }

  const handleRowUpdate = (field, value, income) => {
    const updated = { ...income, [field]: value }
    updateIncome(updated)
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
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errText}`)
      }
      const result = await response.text()
      console.log('Delete income result:', result)
      
      // Reload incomes
      await loadIncomes(userId, token)
    } catch (e) {
      console.error('Delete error:', e)
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

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16 }}>
        <h2>Income</h2>
        
        <form onSubmit={addIncome} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
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
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
            }}>Add Income</button>
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

        <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <thead>
            <tr>
              {['Amount','Source','Date','Description','Type','Actions'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incomes.map(income => (
              <tr key={income.id}>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="number" 
                    step="0.01" 
                    defaultValue={income.amount} 
                    onBlur={(e) => { handleRowUpdate('amount', Number(e.target.value), income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('amount', Number(e.target.value), income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    
                  />
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="text" 
                    defaultValue={income.source} 
                    onBlur={(e) => { handleRowUpdate('source', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('source', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    
                  />
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="date" 
                    defaultValue={formatDateForInput(income.date)} 
                    onBlur={(e) => { handleRowUpdate('date', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('date', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    
                  />
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="text" 
                    defaultValue={income.description || ''} 
                    onBlur={(e) => { handleRowUpdate('description', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('description', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    
                  />
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <span style={{ 
                    color: income.isRecurring ? '#28a745' : '#6c757d',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {income.isRecurring ? 'Recurring' : 'One-time'}
                  </span>
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <button 
                    onClick={() => deleteIncome(income.id)}
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 10, cursor: 'pointer' }}
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