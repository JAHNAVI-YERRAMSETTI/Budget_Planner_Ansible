import React, { useEffect, useState, useCallback } from 'react';
import UserNavBar from './UserNavBar';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Income = () => {
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form states
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState('');
    const [incomeDate, setIncomeDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);

    // Filter states
    const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [showAll, setShowAll] = useState(false);

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
    };
    
    const loadIncomes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';

            if (!userId) {
                throw new Error('User not logged in. Please login again.');
            }

            let url;
            if (showAll) {
                url = `${API_URL}/incomes/user/${userId}/all`;
            } else {
                const [year, month] = filterMonth.split('-');
                url = `${API_URL}/incomes/user/${userId}?year=${year}&month=${month}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            setIncomes(data);
        } catch (e) {
            setError(e.message || 'Failed to load incomes.');
        } finally {
            setLoading(false);
        }
    }, [filterMonth, showAll]);

    useEffect(() => {
        loadIncomes();
    }, [loadIncomes]);

    const addIncome = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            
            const response = await fetch(`${API_URL}/incomes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
                body: JSON.stringify({ 
                    amount: Number(amount), 
                    source, 
                    date: incomeDate,
                    description: description || null,
                    isRecurring,
                    user: { id: userId }
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            setSuccessMessage('Income added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            
            await loadIncomes();
            
            setAmount('');
            setSource('');
            setDescription('');
            setIsRecurring(false);
            setIncomeDate(new Date().toISOString().split('T')[0]);

        } catch (e) {
            setError(e.message || 'Failed to add income.');
        }
    };

    const handleRowUpdate = async (field, value, income) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            
            const updatedIncome = { ...income, [field]: value, user: { id: userId } };

            const response = await fetch(`${API_URL}/incomes/${income.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
                body: JSON.stringify(updatedIncome)
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            await loadIncomes();
        } catch (e) {
            setError(e.message || 'Failed to update income.');
            loadIncomes(); // Reload to revert UI change on failure
        }
    };
    
    const deleteIncome = async (incomeId) => {
        if (!window.confirm("Are you sure you want to delete this income record?")) return;
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`${API_URL}/incomes/${incomeId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            await loadIncomes();
        } catch (e) {
            setError(e.message || 'Failed to delete income.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/user/login');
    };

    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
    
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
              <input type="month" value={filterMonth} disabled={showAll} onChange={(e)=>setFilterMonth(e.target.value)} />
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input type="checkbox" checked={showAll} onChange={(e)=>setShowAll(e.target.checked)} />
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
              {incomes.map(income => (
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

          <div style={{ marginTop: 12, fontSize: '1.2em', fontWeight: 'bold' }}>Total for Period: ${totalIncome.toFixed(2)}</div>
        </div>
      </div>
    );
}

export default Income;