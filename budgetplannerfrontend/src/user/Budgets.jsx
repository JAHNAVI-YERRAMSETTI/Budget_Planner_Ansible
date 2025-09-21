import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Budgets = () => {
  const navigate = useNavigate()
  const [budgetGoals, setBudgetGoals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [warningThreshold, setWarningThreshold] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Set default dates when component mounts (full current month to match backend)
  useEffect(() => {
    const now = new Date('2025-09-21') // Hardcoded for consistency with current date
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')

        // Get user data and check ID
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = user.id || user.userId || user.user_id
        
        if (!userId) {
          setError('User not logged in properly. Please login again.')
          return
        }

        // Fetch budget goals for user
        const token = localStorage.getItem('token') || ''
        
        const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (!goalsResponse.ok) throw new Error(`HTTP ${goalsResponse.status} - ${await goalsResponse.text()}`)
        const goalsData = await goalsResponse.json()
        if (mounted) setBudgetGoals(goalsData)

        // Fetch categories
        const categoriesResponse = await fetch(`${config.url}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (mounted) setCategories(categoriesData)
        } else {
          console.error('Failed to load categories:', categoriesResponse.status, await categoriesResponse.text())
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
        console.error('Fetch error:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const totalGoalAmount = useMemo(
    () => budgetGoals.reduce((s, g) => s + Number(g.monthlyLimit || 0), 0),
    [budgetGoals]
  )

  const addBudgetGoal = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    // Validation
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date')
      return
    }
    if (!categoryId || Number(categoryId) <= 0) {
      setError('Please select a valid category')
      return
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setError('Target amount must be greater than 0')
      return
    }

    try {
      // Get user data and check ID
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.id || user.userId || user.user_id
      
      if (!userId) {
        setError('User not logged in properly. Please login again.')
        return
      }

      const token = localStorage.getItem('token') || ''
      
      const response = await fetch(`${config.url}/budgetgoal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          monthlyLimit: Number(targetAmount),
          startDate: startDate,
          endDate: endDate,
          warningThreshold: warningThreshold ? Number(warningThreshold) : 70,
          user: { id: userId },
          category: { id: Number(categoryId) }
        })
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status} - Failed to add goal`)
      }
      
      console.log('Add budget goal result:', responseData.message)
      setSuccessMessage('Budget goal added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)

      // Reload budget goals
      const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (goalsResponse.ok) {
        const goals = await goalsResponse.json()
        setBudgetGoals(goals)
      }

      // Reset form
      setTargetAmount('')
      setStartDate('')
      setEndDate('')
      setCategoryId('')
      setWarningThreshold('')
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteBudgetGoal = async (budgetGoalId) => {
    if (!confirm('Are you sure you want to delete this budget goal?')) return
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.id || user.userId || user.user_id
      const token = localStorage.getItem('token') || ''
      
      const response = await fetch(`${config.url}/budgetgoal/${budgetGoalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status} - Failed to delete goal`)
      }
      
      console.log('Delete budget goal result:', responseData.message)

      // Reload budget goals
      const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (goalsResponse.ok) {
        const goals = await goalsResponse.json()
        setBudgetGoals(goals)
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

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Budget Goals</h2>
        <form onSubmit={addBudgetGoal} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Budget Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Target Amount"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Warning % (optional)"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(e.target.value)}
              title="Percentage threshold for budget warnings (e.g., 70% means warn when 70% of budget is used)"
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Add Goal</button>
          </div>
        </form>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        {budgetGoals.length === 0 ? (
          <div>No budget goals yet. Add one above!</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Target Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Warning %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetGoals.map(goal => {
                const warningThreshold = goal.warningThreshold || 70
                const isNearWarning = false // Placeholder: Implement based on spending later
                const statusColor = goal.exceeded ? '#dc3545' : (isNearWarning ? '#ffc107' : '#17a2b8')
                
                // Updated category lookup - use categoryId from JSON
                const categoryName = categories.find(c => c.id === goal.categoryId)?.name || 'Uncategorized'
                
                return (
                  <tr key={goal.id}>
                    <td>{categoryName}</td>
                    <td>${(goal.monthlyLimit || 0).toLocaleString()}</td>
                    <td>{goal.startDate || 'N/A'}</td>
                    <td>{goal.endDate || 'N/A'}</td>
                    <td>{warningThreshold}%</td>
                    <td>
                      <span style={{ 
                        color: statusColor, 
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: statusColor + '20'
                      }}>
                        {goal.exceeded ? 'Exceeded' : (isNearWarning ? 'Warning' : 'Active')}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => deleteBudgetGoal(goal.id)}
                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 12 }}>Total Goal Amount: ${totalGoalAmount.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default Budgets