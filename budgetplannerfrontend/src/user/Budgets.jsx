import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Budgets = () => {
  const navigate = useNavigate()
  const [budgetGoals, setBudgetGoals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [goalname, setGoalname] = useState('')
  const [amountGoal, setAmountGoal] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${config.url}/budgetgoal/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setBudgetGoals(data)
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user.id])

  const totalGoalAmount = useMemo(() => budgetGoals.reduce((s, g) => s + Number(g.amountGoal || 0), 0), [budgetGoals])

  const addBudgetGoal = async (e) => {
    e.preventDefault()
    setError('') // Clear any previous errors
    try {
      const response = await fetch(`${config.url}/budgetgoal/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          goalname, 
          amountGoal: Number(amountGoal), 
          targetDate: new Date(targetDate),
          userid: user.id 
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text() // Backend returns plain text, not JSON
      console.log('Add goal result:', result)
      setSuccessMessage('Budget goal added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000) // Clear message after 3 seconds
      // Reload goals after successful addition
      const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (goalsResponse.ok) {
        const goals = await goalsResponse.json()
        setBudgetGoals(goals)
      }
      setGoalname('')
      setAmountGoal('')
      setTargetDate('')
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('') // Clear success message on error
    }
  }

  const updateBudgetGoal = async (goal) => {
    try {
      const response = await fetch(`${config.url}/budgetgoal/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text() // Backend returns plain text, not JSON
      console.log('Update goal result:', result)
      // Reload goals after successful update
      const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
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

  const deleteBudgetGoal = async (budgetGoalId) => {
    try {
      const response = await fetch(`${config.url}/budgetgoal/delete/${budgetGoalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text() // Backend returns plain text, not JSON
      console.log('Delete goal result:', result)
      // Reload goals after successful deletion
      const goalsResponse = await fetch(`${config.url}/budgetgoal/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
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
    navigate('/user/login')
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Budget Goals</h2>
        <form onSubmit={addBudgetGoal} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Budget Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <input placeholder="Goal Name" required value={goalname} onChange={(e) => setGoalname(e.target.value)} />
            <input type="number" step="0.01" placeholder="Amount Goal" required value={amountGoal} onChange={(e) => setAmountGoal(e.target.value)} />
            <input type="date" placeholder="Target Date" required value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            <button type="submit">Add Goal</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Goal Name</th>
              <th>Amount Goal</th>
              <th>Target Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetGoals.map(goal => (
              <tr key={goal.id}>
                <td>
                  <input 
                    type="text" 
                    value={goal.goalname} 
                    onChange={(e) => {
                      const updatedGoal = { ...goal, goalname: e.target.value }
                      updateBudgetGoal(updatedGoal)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={goal.amountGoal} 
                    onChange={(e) => {
                      const updatedGoal = { ...goal, amountGoal: Number(e.target.value) }
                      updateBudgetGoal(updatedGoal)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="date" 
                    value={goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : ''} 
                    onChange={(e) => {
                      const updatedGoal = { ...goal, targetDate: new Date(e.target.value) }
                      updateBudgetGoal(updatedGoal)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
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
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>Total Goal Amount: ${totalGoalAmount.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default Budgets
