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
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [useManual, setUseManual] = useState(false)
  
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
        const reportsResponse = await fetch(`${config.url}/analysis/all/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (reportsResponse.ok) {
          const data = await reportsResponse.json()
          if (mounted) setAnalysisReports(Array.isArray(data) ? data : [])
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

  const handleCategorySelect = (e) => {
    const category = e.target.value
    setLoading(true)
    setSelectedCategory(category)
    setTimeout(() => setLoading(false), 500)
  }

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
    if (!useManual) {
      setCategorySpending({})
    }
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
      const reportsResponse = await fetch(`${config.url}/analysis/all/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setAnalysisReports(Array.isArray(reportsData) ? reportsData : [])
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

  // Get filtered reports based on selected category
  const getFilteredReports = () => {
    if (selectedCategory === 'All' || !analysisReports.length) return analysisReports
    return analysisReports.filter(report => report.categorySpending && report.categorySpending[selectedCategory] > 0)
  }

  // Generate chart data for category analysis
  const generateCategoryChartData = () => {
    if (!analysisReports.length) return null
    
    const latestReport = analysisReports[0]
    if (!latestReport.categorySpending) return null
    
    let categories, amounts
    if (selectedCategory === 'All') {
      categories = Object.keys(latestReport.categorySpending)
      amounts = Object.values(latestReport.categorySpending)
    } else {
      const spent = latestReport.categorySpending[selectedCategory] || 0
      const budget = latestReport.categoryBudgets?.[selectedCategory] || 0
      const remaining = budget - spent
      categories = [selectedCategory, 'Remaining']
      amounts = [spent, remaining > 0 ? remaining : 0]
    }
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Spending by Category',
          data: amounts,
          backgroundColor: selectedCategory === 'All' 
            ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384']
            : ['#FF6384', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    }
  }

  // Generate 6-month trend data
  const generateTrendChartData = () => {
    if (!analysisReports.length) return null
    
    const last6Months = getFilteredReports().slice(0, 6).reverse()
    const months = last6Months.map(report => 
      report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'
    )
    let spending, savings
    if (selectedCategory === 'All') {
      spending = last6Months.map(report => report.totalSpent || 0)
      savings = last6Months.map(report => report.totalSaved || 0)
    } else {
      spending = last6Months.map(report => report.categorySpending?.[selectedCategory] || 0)
      savings = last6Months.map(report => {
        const spent = report.categorySpending?.[selectedCategory] || 0
        const totalIncome = report.totalSaved + report.totalSpent // approximate
        return totalIncome - spent
      })
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: selectedCategory === 'All' ? 'Spending' : `${selectedCategory} Spending`,
          data: spending,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        },
        {
          label: selectedCategory === 'All' ? 'Savings' : `${selectedCategory} Remaining`,
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

  const getCategoryStatus = (report, cat) => {
    const spent = report.categorySpending?.[cat] || 0
    const budget = report.categoryBudgets?.[cat] || 0
    const percentage = budget > 0 ? (spent / budget) * 100 : 0
    if (percentage > 100) return 'Over Budget'
    if (percentage > 80) return 'Warning'
    return 'Normal'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
        <h2>Financial Analysis</h2>
        
        <form onSubmit={generateAnalysisReport} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <h3>Generate Analysis Report</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={useManual} 
                onChange={(e) => setUseManual(e.target.checked)} 
              />
              Use Manual Category (optional, uncheck for auto from expenses)
            </label>
          </div>
          
          {useManual && (
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
                <button type="button" onClick={addCategorySpending} style={{
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
                }}>Add Category</button>
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
          )}
          
          {!useManual && (
            <p style={{ color: '#6c757d' }}>Will automatically fetch and categorize from expenses and transactions.</p>
          )}
          
          <button type="submit" disabled={useManual && Object.keys(categorySpending).length === 0} style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
          }}>
            Generate Analysis Report {useManual ? '(Manual)' : '(Auto from Expenses)'}
          </button>
        </form>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        {analysisReports.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              View Category: 
              <select value={selectedCategory} onChange={handleCategorySelect} style={{ padding: 4 }}>
                <option value="All">All Categories</option>
                {analysisReports[0]?.categorySpending && Object.keys(analysisReports[0].categorySpending).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {selectedCategory !== 'All' && analysisReports.length > 0 && (
          <div className="card" style={{ padding: 16, marginBottom: 16, border: '1px solid #dee2e6' }}>
            <h4>{selectedCategory} Details (Latest Report)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#ffeaea', borderRadius: 8 }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#dc3545' }}>Spent</h5>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                  {formatCurrency(analysisReports[0].categorySpending?.[selectedCategory])}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e8f5e8', borderRadius: 8 }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#28a745' }}>Budget</h5>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {formatCurrency(analysisReports[0].categoryBudgets?.[selectedCategory])}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Remaining</h5>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>
                  {formatCurrency(
                    (analysisReports[0].categoryBudgets?.[selectedCategory] || 0) - (analysisReports[0].categorySpending?.[selectedCategory] || 0)
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#fff3e0', borderRadius: 8 }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ff9800' }}>Status</h5>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800' }}>
                  {getCategoryStatus(analysisReports[0], selectedCategory)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          {getFilteredReports().map(report => (
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
                    {formatCurrency(selectedCategory === 'All' ? report.totalSpent : (report.categorySpending?.[selectedCategory] || 0))}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', padding: 12, backgroundColor: '#e8f5e8', borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>Total Saved</h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {formatCurrency(selectedCategory === 'All' ? report.totalSaved : (report.totalSaved + (report.totalSpent - (report.categorySpending?.[selectedCategory] || 0))))}
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