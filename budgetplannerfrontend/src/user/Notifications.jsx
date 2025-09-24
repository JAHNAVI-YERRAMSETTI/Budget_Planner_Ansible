import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Notifications = () => {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Load alerts, budgets, and expenses
        const [alertsResponse, budgetsResponse, expensesResponse] = await Promise.all([
          fetch(`${config.url}/alerts`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${config.url}/budgetgoals/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${config.url}/expenses/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          })
        ])
        
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          if (mounted) setAlerts(alertsData)
        }
        
        if (budgetsResponse.ok) {
          const budgetsData = await budgetsResponse.json()
          if (mounted) setBudgets(budgetsData)
        }
        
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json()
          if (mounted) setExpenses(expensesData)
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

  const markAsRead = async (alert) => {
    try {
      const response = await fetch(`${config.url}/alerts/${alert.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...alert, resolved: true })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // Update local state
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, resolved: true } : a))
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'ERROR': return '#dc3545'
      case 'WARNING': return '#ffc107'
      case 'SUCCESS': return '#28a745'
      case 'INFO': return '#17a2b8'
      default: return '#6c757d'
    }
  }

  // Generate budget threshold alerts
  const generateBudgetAlerts = () => {
    const budgetAlerts = []
    const currentDate = new Date()
    
    budgets.forEach(budget => {
      const budgetStart = new Date(budget.startDate)
      const budgetEnd = new Date(budget.endDate)
      
      // Check if budget is currently active
      if (currentDate >= budgetStart && currentDate <= budgetEnd) {
        const categoryName = budget.category?.name || 'Uncategorized'
        
        // Calculate spending for this category in the budget period
        const categoryExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.expenseDate)
          return expense.category?.name === categoryName && 
                 expenseDate >= budgetStart && 
                 expenseDate <= budgetEnd
        })
        
        const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const spendingPercentage = (totalSpent / budget.targetAmount) * 100
        const warningThreshold = budget.warningThreshold || 70
        
        if (spendingPercentage >= warningThreshold) {
          budgetAlerts.push({
            id: `budget-${budget.id}`,
            type: spendingPercentage >= 100 ? 'ERROR' : 'WARNING',
            message: `Budget Alert: ${categoryName} - ${spendingPercentage.toFixed(1)}% of budget used (${spendingPercentage >= 100 ? 'Over budget!' : 'Approaching limit'})`,
            timestamp: new Date().toISOString(),
            resolved: false,
            budgetId: budget.id,
            category: categoryName,
            spent: totalSpent,
            budget: budget.targetAmount,
            percentage: spendingPercentage
          })
        }
      }
    })
    
    return budgetAlerts
  }

  const budgetAlerts = generateBudgetAlerts()
  const allAlerts = [...alerts, ...budgetAlerts]
  const unreadAlerts = allAlerts.filter(alert => !alert.resolved)
  const recentAlerts = allAlerts.slice(0, 10) // Show only recent 10 alerts

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ marginLeft: '248px', padding: 16, background: '#ffffff', minHeight: '100vh' }}>
        <h2>Notifications</h2>
        
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <div style={{ marginBottom: 16 }}>
          <strong>Unresolved Notifications: {unreadAlerts.length}</strong>
        </div>

        {recentAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
            <h3>No notifications</h3>
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {recentAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="card" 
                style={{ 
                  padding: 16, 
                  border: '1px solid #dee2e6',
                  backgroundColor: alert.resolved ? '#f8f9fa' : '#fff3cd',
                  borderLeft: `4px solid ${getAlertTypeColor(alert.type)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      marginBottom: 8 
                    }}>
                      <span style={{ 
                        color: getAlertTypeColor(alert.type),
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textTransform: 'uppercase'
                      }}>
                        {alert.type}
                      </span>
                      {!alert.resolved && (
                        <span style={{ 
                          backgroundColor: '#dc3545',
                          color: 'white',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontWeight: alert.resolved ? 'normal' : 'bold' }}>
                      {alert.message}
                    </p>
                    {alert.budgetId && (
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: 4 }}>
                        <strong>Budget Details:</strong> ${alert.spent?.toFixed(2)} spent of ${alert.budget?.toFixed(2)} budget ({alert.percentage?.toFixed(1)}%)
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button 
                      onClick={() => markAsRead(alert)}
                      style={{ 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Showing {recentAlerts.length} of {alerts.length} notifications
          </p>
        </div>
      </div>
    </div>
  )
}

export default Notifications
