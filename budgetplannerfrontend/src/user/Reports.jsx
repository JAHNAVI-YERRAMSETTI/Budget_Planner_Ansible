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
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const Reports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${config.url}/reports/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setReports(data)
      } catch (e) { 
        if (mounted) setError(String(e.message || e)) 
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user.id])

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

  // Sort reports by month (most recent first)
  const sortedReports = [...reports].sort((a, b) => {
    return new Date(b.month) - new Date(a.month)
  })

  // Generate comprehensive chart data
  const generateSavingsChartData = () => {
    if (sortedReports.length === 0) return null
    
    const last12Months = sortedReports.slice(0, 12).reverse()
    const months = last12Months.map(report => 
      report.month ? new Date(report.month).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'
    )
    const savings = last12Months.map(report => getNetIncome(report))
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Savings',
          data: savings,
          borderColor: savings.map(s => s >= 0 ? '#28a745' : '#dc3545'),
          backgroundColor: savings.map(s => s >= 0 ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'),
          tension: 0.1,
        },
      ],
    }
  }

  const generateIncomeVsExpenseChartData = () => {
    if (sortedReports.length === 0) return null
    
    const last6Months = sortedReports.slice(0, 6).reverse()
    const months = last6Months.map(report => 
      report.month ? new Date(report.month).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'
    )
    const incomes = last6Months.map(report => report.totalIncome || 0)
    const expenses = last6Months.map(report => report.totalExpense || 0)
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomes,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: expenses,
          backgroundColor: 'rgba(220, 53, 69, 0.8)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
        <h2>Financial Reports</h2>
        
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        {/* Charts Section */}
        {sortedReports.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3>Financial Overview Charts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
              {/* Savings Trend Chart */}
              {generateSavingsChartData() && (
                <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ marginBottom: 16, textAlign: 'center' }}>12-Month Savings Trend</h4>
                  <Line 
                    data={generateSavingsChartData()} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: false
                        }
                      }
                    }} 
                  />
                </div>
              )}

              {/* Income vs Expense Chart */}
              {generateIncomeVsExpenseChartData() && (
                <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ marginBottom: 16, textAlign: 'center' }}>Income vs Expenses (6 Months)</h4>
                  <Bar 
                    data={generateIncomeVsExpenseChartData()} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: false
                        }
                      }
                    }} 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {sortedReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
            <h3>No reports available</h3>
            <p>Generate monthly reports to see your financial trends and analysis.</p>
          </div>
        ) : (
          <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
            <thead>
              <tr>
                {['Month/Year','Total Income','Total Expenses','Net Income','Savings Rate','Generated'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedReports.map((report, idx) => {
                const prevReport = idx > 0 ? sortedReports[idx - 1] : null
                const netIncome = getNetIncome(report)
                const savingsRate = report.totalIncome > 0 ? ((netIncome / report.totalIncome) * 100).toFixed(1) : 0
                const expenseChange = prevReport ? 
                  (((report.totalExpense - prevReport.totalExpense) / (prevReport.totalExpense || 1)) * 100) : 0
                
                return (
                  <tr 
                    key={report.id} 
                    style={{ 
                      transition: 'background 0.2s ease',
                      backgroundColor: netIncome >= 0 ? 'rgba(40, 167, 69, 0.05)' : 'rgba(220, 53, 69, 0.05)'
                    }} 
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} 
                    onMouseLeave={(e) => (e.currentTarget.style.background = netIncome >= 0 ? 'rgba(40, 167, 69, 0.05)' : 'rgba(220, 53, 69, 0.05)')}
                  >
                    <td>
                      <strong>{report.month ? new Date(report.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</strong>
                      {expenseChange !== 0 && (
                        <div style={{ fontSize: '12px', color: expenseChange > 0 ? '#dc3545' : '#28a745' }}>
                          {expenseChange > 0 ? '↗' : '↘'} {Math.abs(expenseChange).toFixed(1)}% vs prev
                        </div>
                      )}
                    </td>
                    <td style={{ color: '#28a745', fontWeight: 'bold' }}>
                      {formatCurrency(report.totalIncome)}
                    </td>
                    <td style={{ color: '#dc3545', fontWeight: 'bold' }}>
                      {formatCurrency(report.totalExpense)}
                    </td>
                    <td style={{ 
                      color: netIncome >= 0 ? '#28a745' : '#dc3545', 
                      fontWeight: 'bold' 
                    }}>
                      {formatCurrency(netIncome)}
                    </td>
                    <td style={{ 
                      color: savingsRate >= 0 ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {savingsRate}%
                    </td>
                    <td style={{ fontSize: '12px', color: '#6c757d' }}>
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Total Reports: {reports.length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Reports
