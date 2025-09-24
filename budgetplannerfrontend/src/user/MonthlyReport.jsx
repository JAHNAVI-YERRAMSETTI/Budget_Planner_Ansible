import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const MonthlyReport = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states for generating new report
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Load reports, budgets, and expenses
        const [reportsResponse, budgetsResponse, expensesResponse] = await Promise.all([
          fetch(`${config.url}/reports`, {
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
        
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json()
          if (mounted) setReports(reportsData)
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

  const generateReport = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${config.url}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          month: new Date(selectedYear, selectedMonth - 1, 1),
          user: { id: user.id }
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Generate report result:', result)
      setSuccessMessage('Report generated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload reports
      const reportsResponse = await fetch(`${config.url}/reports`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setReports(reportsData)
      }
      
      // Reset form
      setSelectedMonth('')
      setSelectedYear('')
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const deleteReport = async (reportId) => {
    try {
      const response = await fetch(`${config.url}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete report result:', result)
      
      // Reload reports
      const reportsResponse = await fetch(`${config.url}/reports`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setReports(reportsData)
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

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1] || 'Unknown'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const getNetIncome = (report) => {
    return (report.totalIncome || 0) - (report.totalExpense || 0)
  }

  const getSavingsRate = (report) => {
    const netIncome = getNetIncome(report)
    const totalIncome = report.totalIncome || 0
    return totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0
  }

  // Calculate budget vs actual spending for a specific month
  const getBudgetVsActual = (report) => {
    if (!report.month) return {}
    
    const reportDate = new Date(report.month)
    const monthStart = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1)
    const monthEnd = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0)
    
    // Filter budgets and expenses for the specific month
    const monthBudgets = budgets.filter(budget => {
      const budgetStart = new Date(budget.startDate)
      const budgetEnd = new Date(budget.endDate)
      return budgetStart <= monthEnd && budgetEnd >= monthStart
    })
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })
    
    // Group by category
    const budgetByCategory = {}
    const actualByCategory = {}
    
    monthBudgets.forEach(budget => {
      const categoryName = budget.category?.name || 'Uncategorized'
      budgetByCategory[categoryName] = (budgetByCategory[categoryName] || 0) + budget.targetAmount
    })
    
    monthExpenses.forEach(expense => {
      const categoryName = expense.category?.name || 'Uncategorized'
      actualByCategory[categoryName] = (actualByCategory[categoryName] || 0) + expense.amount
    })
    
    // Calculate remaining amounts
    const remainingByCategory = {}
    Object.keys(budgetByCategory).forEach(category => {
      const budgeted = budgetByCategory[category] || 0
      const actual = actualByCategory[category] || 0
      remainingByCategory[category] = budgeted - actual
    })
    
    return {
      budgeted: budgetByCategory,
      actual: actualByCategory,
      remaining: remainingByCategory
    }
  }

  // Generate chart data for budget vs actual
  const generateBudgetChartData = (report) => {
    const budgetData = getBudgetVsActual(report)
    const categories = Object.keys(budgetData.budgeted)
    
    if (categories.length === 0) return null
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Budgeted',
          data: categories.map(cat => budgetData.budgeted[cat] || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Actual',
          data: categories.map(cat => budgetData.actual[cat] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16 }}>
        <h2>Monthly Reports</h2>
        
        <form onSubmit={generateReport} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <h3>Generate New Report</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <select 
              required 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            <input 
              type="number" 
              min="2020" 
              max="2030" 
              placeholder="Year" 
              required 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
            />
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
            }}>Generate Report</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <div style={{ display: 'grid', gap: 12 }}>
          {reports.map(report => (
            <div key={report.id} className="card" style={{ padding: 16, border: '1px solid #dee2e6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: '#495057' }}>
                  {report.month ? new Date(report.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </h3>
                <button 
                  onClick={() => deleteReport(report.id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Delete Report
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e8f5e8', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>Total Income</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {formatCurrency(report.totalIncome)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#ffeaea', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#dc3545' }}>Total Expenses</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                    {formatCurrency(report.totalExpense)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: getNetIncome(report) >= 0 ? '#e8f5e8' : '#ffeaea', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: getNetIncome(report) >= 0 ? '#28a745' : '#dc3545' }}>Net Income</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: getNetIncome(report) >= 0 ? '#28a745' : '#dc3545' }}>
                    {formatCurrency(getNetIncome(report))}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Savings Rate</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                    {getSavingsRate(report)}%
                  </div>
                </div>
              </div>
              
              {report.highSpendingCategory && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>High Spending Category</h4>
                  <div style={{ 
                    padding: 8, 
                    backgroundColor: '#fff3e0', 
                    borderRadius: 4, 
                    textAlign: 'center',
                    border: '1px solid #ffb74d'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#e65100' }}>{report.highSpendingCategory}</div>
                  </div>
                </div>
              )}

              {/* Budget vs Actual Chart */}
              {generateBudgetChartData(report) && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Budget vs Actual Spending</h4>
                  <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Bar 
                      data={generateBudgetChartData(report)} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Budget vs Actual Summary */}
              {(() => {
                const budgetData = getBudgetVsActual(report)
                const categories = Object.keys(budgetData.budgeted)
                
                if (categories.length === 0) return null
                
                return (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Budget Summary by Category</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                      {categories.map(category => {
                        const budgeted = budgetData.budgeted[category] || 0
                        const actual = budgetData.actual[category] || 0
                        const remaining = budgetData.remaining[category] || 0
                        const isOverBudget = remaining < 0
                        
                        return (
                          <div key={category} style={{ 
                            padding: 12, 
                            backgroundColor: isOverBudget ? '#ffeaea' : '#e8f5e8', 
                            borderRadius: 8, 
                            border: `1px solid ${isOverBudget ? '#dc3545' : '#28a745'}`,
                            textAlign: 'center'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '14px' }}>{category}</div>
                            <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: 4 }}>
                              Budget: {formatCurrency(budgeted)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: 4 }}>
                              Spent: {formatCurrency(actual)}
                            </div>
                            <div style={{ 
                              fontWeight: 'bold', 
                              color: isOverBudget ? '#dc3545' : '#28a745',
                              fontSize: '14px'
                            }}>
                              {isOverBudget ? 'Over by ' : 'Remaining '}{formatCurrency(Math.abs(remaining))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
              
              <div style={{ marginTop: 12, fontSize: '12px', color: '#6c757d' }}>
                Generated on: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
            <h3>No reports generated yet</h3>
            <p>Generate your first monthly report to see your financial summary.</p>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          Total Reports: {reports.length}
        </div>
      </div>
    </div>
  )
}

export default MonthlyReport
