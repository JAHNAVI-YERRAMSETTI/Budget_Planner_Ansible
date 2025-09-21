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

const Analysis = () => {
  const navigate = useNavigate()
  const [analysisReports, setAnalysisReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states for generating new report
  const [categorySpending, setCategorySpending] = useState({})
  const [newCategory, setNewCategory] = useState('')
  const [newAmount, setNewAmount] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${config.url}/analysis/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const data = await response.json()
          if (mounted) setAnalysisReports(Array.isArray(data) ? data : [data])
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

  const addCategorySpending = () => {
    if (newCategory && newAmount) {
      setCategorySpending(prev => ({
        ...prev,
        [newCategory]: Number(newAmount)
      }))
      setNewCategory('')
      setNewAmount('')
    }
  }

  const removeCategorySpending = (category) => {
    setCategorySpending(prev => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })
  }

  const generateAnalysisReport = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${config.url}/analysis?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categorySpending)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      console.log('Generate analysis report result:', result)
      setSuccessMessage('Analysis report generated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload reports
      const reportsResponse = await fetch(`${config.url}/analysis/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setAnalysisReports(Array.isArray(reportsData) ? reportsData : [reportsData])
      }
      
      // Reset form
      setCategorySpending({})
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`
  }

  // Generate chart data for category analysis
  const generateCategoryChartData = () => {
    if (!analysisReports.length) return null
    
    const latestReport = analysisReports[0]
    if (!latestReport.categorySpending) return null
    
    const categories = Object.keys(latestReport.categorySpending)
    const amounts = Object.values(latestReport.categorySpending)
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Spending by Category',
          data: amounts,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384'
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  // Generate 6-month trend data
  const generateTrendChartData = () => {
    if (!analysisReports.length) return null
    
    const last6Months = analysisReports.slice(0, 6).reverse()
    const months = last6Months.map(report => 
      report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'
    )
    const spending = last6Months.map(report => report.totalSpent || 0)
    const savings = last6Months.map(report => report.totalSaved || 0)
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Spending',
          data: spending,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Savings',
          data: savings,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
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
      title: {
        display: true,
        text: 'Financial Analysis Charts',
      },
    },
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Financial Analysis</h2>
        
        <form onSubmit={generateAnalysisReport} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Generate Analysis Report</h3>
          
          <div style={{ marginBottom: 16 }}>
            <h4>Category Spending Data</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input 
                placeholder="Category Name" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
              />
              <input 
                type="number" 
                step="0.01" 
                placeholder="Amount" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)} 
              />
              <button type="button" onClick={addCategorySpending}>Add Category</button>
            </div>
            
            {Object.keys(categorySpending).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h5>Categories to Analyze:</h5>
                {Object.entries(categorySpending).map(([category, amount]) => (
                  <div key={category} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: 8,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 4,
                    margin: '4px 0'
                  }}>
                    <span><strong>{category}:</strong> {formatCurrency(amount)}</span>
                    <button 
                      type="button"
                      onClick={() => removeCategorySpending(category)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '2px 6px', 
                        borderRadius: '3px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button type="submit" disabled={Object.keys(categorySpending).length === 0}>
            Generate Analysis Report
          </button>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <div style={{ display: 'grid', gap: 16 }}>
          {analysisReports.map(report => (
            <div key={report.id} className="card" style={{ padding: 16, border: '1px solid #dee2e6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: '#495057' }}>
                  Analysis Report - {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : 'N/A'}
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#ffeaea', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#dc3545' }}>Total Spent</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                    {formatCurrency(report.totalSpent)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e8f5e8', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>Total Saved</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {formatCurrency(report.totalSaved)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Spent Percentage</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                    {formatPercentage(report.spentPercentage)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#fff3e0', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#ff9800' }}>Previous Month</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                    {formatPercentage(report.previousMonthComparison)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#f3e5f5', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#9c27b0' }}>6-Month Average</h4>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9c27b0' }}>
                    {formatCurrency(report.sixMonthAverage)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e0f2f1', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#00695c' }}>Yearly Total</h4>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00695c' }}>
                    {formatCurrency(report.yearlyTotal)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#fce4ec', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#c2185b' }}>High Spending Category</h4>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#c2185b' }}>
                    {report.highSpendingCategory || 'N/A'}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: report.hasTremendousGrowth ? '#ffebee' : '#e8f5e8', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: report.hasTremendousGrowth ? '#d32f2f' : '#2e7d32' }}>Growth Status</h4>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: report.hasTremendousGrowth ? '#d32f2f' : '#2e7d32' }}>
                    {report.hasTremendousGrowth ? 'High Growth' : 'Normal'}
                  </div>
                </div>
              </div>
              
              {report.categorySpending && Object.keys(report.categorySpending).length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Category Breakdown</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
                    {Object.entries(report.categorySpending).map(([category, amount]) => (
                      <div key={category} style={{ 
                        padding: 8, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 4, 
                        textAlign: 'center',
                        border: '1px solid #dee2e6'
                      }}>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: 4 }}>{category}</div>
                        <div style={{ fontWeight: 'bold', color: '#495057' }}>{formatCurrency(amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {analysisReports.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
            <h3>No analysis reports generated yet</h3>
            <p>Generate your first analysis report to see detailed financial insights and spending patterns.</p>
          </div>
        )}

        {/* Charts Section */}
        {analysisReports.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3>Visual Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
              {/* Category Spending Chart */}
              {generateCategoryChartData() && (
                <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ marginBottom: 16, textAlign: 'center' }}>Spending by Category</h4>
                  <Doughnut 
                    data={generateCategoryChartData()} 
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

              {/* 6-Month Trend Chart */}
              {generateTrendChartData() && (
                <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ marginBottom: 16, textAlign: 'center' }}>6-Month Trend</h4>
                  <Line 
                    data={generateTrendChartData()} 
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

            {/* Yearly Overview */}
            {analysisReports.length >= 12 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 16, textAlign: 'center' }}>Yearly Overview</h4>
                <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <Bar 
                    data={generateTrendChartData()} 
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
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Total Reports: {analysisReports.length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analysis
