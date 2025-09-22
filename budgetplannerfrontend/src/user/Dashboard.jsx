import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Dashboard = () => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [budgetAlerts, setBudgetAlerts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const userId = user.id || user.userId || user.user_id
        const token = localStorage.getItem('token') || ''

        const authHeaders = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }

        const [incomes, expenses, reports, budgetsData] = await Promise.all([
          fetch(`${config.url}/incomes/user/${userId}`, { headers: authHeaders }).then(res => res.ok ? res.json() : []),
          fetch(`${config.url}/expenses/user/${userId}`, { headers: authHeaders }).then(res => res.ok ? res.json() : []),
          fetch(`${config.url}/reports`, { headers: { ...authHeaders, ...(userId && !token ? { 'Authorization': `Bearer ${userId}` } : {}) } }).then(res => res.ok ? res.json() : []),
          fetch(`${config.url}/budgetgoals/user/${userId}`, { headers: authHeaders }).then(res => res.ok ? res.json() : [])
        ])
        
        // Calculate summary for the selected month
        const [year, monthNum] = month.split('-').map(Number)
        const monthStart = new Date(year, monthNum - 1, 1)
        const monthEnd = new Date(year, monthNum, 0)
        
        const monthIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.incomeDate || income.date)
          return incomeDate >= monthStart && incomeDate <= monthEnd
        })
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.expenseDate)
          return expenseDate >= monthStart && expenseDate <= monthEnd
        })
        
        const totalIncome = monthIncomes.reduce((sum, income) => sum + (income.amount || 0), 0)
        const totalExpenses = monthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
        
        // Generate budget alerts
        const alerts = []
        budgetsData.forEach(budget => {
          const budgetStart = new Date(budget.startDate)
          const budgetEnd = new Date(budget.endDate)
          
          if (monthStart <= budgetEnd && monthEnd >= budgetStart) {
            const categoryName = budget.category?.name || 'Uncategorized'
            const categoryExpenses = expenses.filter(expense => {
              const expenseDate = new Date(expense.expenseDate)
              return expense.category?.name === categoryName && 
                     expenseDate >= monthStart && 
                     expenseDate <= monthEnd
            })
            
            const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            const spendingPercentage = (totalSpent / budget.targetAmount) * 100
            const warningThreshold = budget.warningThreshold || 70
            
            if (spendingPercentage >= warningThreshold) {
              alerts.push({
                category: categoryName,
                spent: totalSpent,
                budget: budget.targetAmount,
                percentage: spendingPercentage,
                isOverBudget: spendingPercentage >= 100
              })
            }
          }
        })

        const s = { income: totalIncome, expenses: totalExpenses }
        const t = reports.slice(0, 6).map(report => ({
          month: report.month ? new Date(report.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
          income: report.totalIncome || 0,
          expenses: report.totalExpense || 0
        }))
        if (mounted) {
          setSummary(s)
          setTrends(t)
          setBudgets(budgetsData)
          setBudgetAlerts(alerts)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [month, user.id])

  const savingsPercent = useMemo(() => {
    if (!summary) return 0
    const income = summary.income || 0
    const expenses = summary.expenses || 0
    if (income <= 0) return 0
    return Math.round(((income - expenses) / income) * 100)
  }, [summary])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Dashboard</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Month: </label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'black' }}>{error}</div>}
        {summary && (
          <div className="cards-grid">
            {[
              { label: 'Income', value: summary.income?.toFixed?.(2) ?? summary.income },
              { label: 'Expenses', value: summary.expenses?.toFixed?.(2) ?? summary.expenses },
              { label: 'Saved', value: (summary.income - summary.expenses)?.toFixed?.(2) },
              { label: 'Saved %', value: `${savingsPercent}%` }
            ].map((c) => (
              <button key={c.label} className="card" style={{ cursor: 'pointer', transition: 'filter 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>
                <div className="card-title">{c.label}</div>
                <div className="card-value">{c.value}</div>
              </button>
            ))}
          </div>
        )}

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ color: '#dc3545' }}>⚠ Budget Alerts</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {budgetAlerts.map((alert, index) => (
                <div key={index} style={{ 
                  padding: 12, 
                  backgroundColor: alert.isOverBudget ? '#ffeaea' : '#fff3cd', 
                  borderRadius: 8, 
                  border: `1px solid ${alert.isOverBudget ? '#dc3545' : '#ffc107'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ color: alert.isOverBudget ? '#dc3545' : '#856404' }}>
                      {alert.category}
                    </strong>
                    <div style={{ fontSize: '14px', color: '#6c757d' }}>
                      ${alert.spent.toFixed(2)} of ${alert.budget.toFixed(2)} ({alert.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <span style={{ 
                    color: alert.isOverBudget ? '#dc3545' : '#856404',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {alert.isOverBudget ? 'OVER BUDGET' : 'WARNING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginTop: 24 }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <button 
              onClick={() => navigate('/user/expense')}
              style={{ 
                padding: 16, 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Add Expense
            </button>
            <button 
              onClick={() => navigate('/user/income')}
              style={{ 
                padding: 16, 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Add Income
            </button>
            <button 
              onClick={() => navigate('/user/budgets')}
              style={{ 
                padding: 16, 
                backgroundColor: '#17a2b8', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Manage Budgets
            </button>
            <button 
              onClick={() => navigate('/user/analysis')}
              style={{ 
                padding: 16, 
                backgroundColor: '#6f42c1', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              View Analysis
            </button>
          </div>
        </div>

        {trends && (
          <div style={{ marginTop: 24 }}>
            <h3>Month-over-Month</h3>
            <ul>
              {trends?.map?.((m) => (
                <li key={m.month}>{m.month}: Income {m.income} | Expenses {m.expenses}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard