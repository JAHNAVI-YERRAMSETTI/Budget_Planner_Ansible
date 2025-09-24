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
  const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0,7))
  const [showAllMonths, setShowAllMonths] = useState(false)

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
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
    const incomesResponse = await fetch(`${config.url}/incomes/user/${userId}`, { headers })
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

  const visibleIncomes = incomes.filter((income) => {
    if (showAllMonths || !filterMonth) return true
    const d = new Date(income.date || income.incomeDate)
    const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    return ym === filterMonth
  })
  const totalIncome = visibleIncomes.reduce((sum, income) => sum + Number(income.amount || 0), 0)

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh', overflowX: 'hidden' }}>
        <h2>Income</h2>
        
        <form onSubmit={addIncome} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <h3>Add Income</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, rowGap: 12 }}>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Amount" 
              required 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
            />
            <input 
              placeholder="Source" 
              required 
              value={source} 
              onChange={(e) => setSource(e.target.value)} 
              style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
            />
            <input 
              type="date" 
              required 
              value={incomeDate} 
              onChange={(e) => setIncomeDate(e.target.value)} 
              style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
            />
            <input 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
            />
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)', minWidth: 180
            }}>Add Income</button>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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

        <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12, flexWrap:'wrap' }}>
          <label style={{ display:'flex', alignItems:'center', gap:8 }}>
            Month:
            <input type="month" value={filterMonth} disabled={showAllMonths} onChange={(e)=>setFilterMonth(e.target.value)} />
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:8 }}>
            <input type="checkbox" checked={showAllMonths} onChange={(e)=>setShowAllMonths(e.target.checked)} />
            Show all months
          </label>
        </div>

        <table className="table" style={{ width:'100%', tableLayout:'fixed', borderCollapse:'separate', borderSpacing:'0 8px', background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '27%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Amount','Source','Date','Description','Type','Actions'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 12px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleIncomes.map(income => (
              <tr key={income.id}>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="number" 
                    step="0.01" 
                    defaultValue={income.amount} 
                    onBlur={(e) => { handleRowUpdate('amount', Number(e.target.value), income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('amount', Number(e.target.value), income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    style={{ width: '100%', height: 38, padding: '6px 10px', boxSizing: 'border-box', borderRadius: 8 }}
                    
                  />
                </td>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="text" 
                    defaultValue={income.source} 
                    onBlur={(e) => { handleRowUpdate('source', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('source', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    style={{ width: '100%', height: 38, padding: '6px 10px', boxSizing: 'border-box', borderRadius: 8 }}
                    
                  />
                </td>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="date" 
                    defaultValue={formatDateForInput(income.date)} 
                    onBlur={(e) => { handleRowUpdate('date', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('date', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    style={{ width: '100%', height: 38, padding: '6px 10px', boxSizing: 'border-box', borderRadius: 8 }}
                    
                  />
                </td>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="text" 
                    defaultValue={income.description || ''} 
                    onBlur={(e) => { handleRowUpdate('description', e.target.value, income); e.currentTarget.style.outline = 'none' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleRowUpdate('description', e.target.value, income)}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    style={{ width: '100%', height: 38, padding: '6px 10px', boxSizing: 'border-box', borderRadius: 8 }}
                    
                  />
                </td>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <span style={{ 
                    color: income.isRecurring ? '#28a745' : '#6c757d',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {income.isRecurring ? 'Recurring' : 'One-time'}
                  </span>
                </td>
                <td style={{ padding:'6px 10px', borderTop:'1px solid #eef2f7' }}>
                  <button 
                    onClick={() => deleteIncome(income.id)}
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', width: '100%' }}
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