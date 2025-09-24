import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Alert = () => {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [message, setMessage] = useState('')
  const [alertType, setAlertType] = useState('INFO')
  const [isRead, setIsRead] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${config.url}/alerts/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setAlerts(data)
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user.id])

  const addAlert = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${config.url}/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message, 
          type: alertType, 
          resolved: isRead,
          user: { id: user.id }
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add alert result:', result)
      setSuccessMessage('Alert added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload alerts
      const alertsResponse = await fetch(`${config.url}/alerts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData)
      }
      
      // Reset form
      setMessage('')
      setAlertType('INFO')
      setIsRead(false)
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateAlert = async (alert) => {
    try {
      const response = await fetch(`${config.url}/alerts/${alert.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update alert result:', result)
      
      // Reload alerts
      const alertsResponse = await fetch(`${config.url}/alerts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteAlert = async (alertId) => {
    try {
      const response = await fetch(`${config.url}/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete alert result:', result)
      
      // Reload alerts
      const alertsResponse = await fetch(`${config.url}/alerts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const markAsRead = async (alert) => {
    const updatedAlert = { ...alert, resolved: true }
    await updateAlert(updatedAlert)
  }

  const markAsUnread = async (alert) => {
    const updatedAlert = { ...alert, resolved: false }
    await updateAlert(updatedAlert)
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

  const unreadCount = alerts.filter(alert => !alert.resolved).length

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
        <h2>Alerts & Notifications</h2>
        
        <form onSubmit={addAlert} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <h3>Add Alert</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <input 
              placeholder="Alert Message" 
              required 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
            />
            <select 
              value={alertType} 
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="SUCCESS">Success</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={isRead} 
                onChange={(e) => setIsRead(e.target.checked)} 
              />
              Mark as Resolved
            </label>
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
            }}>Add Alert</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <div style={{ marginBottom: 12 }}>
          <strong>Unresolved Alerts: {unreadCount}</strong>
        </div>

        <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <thead>
            <tr>
              {['Message','Type','Status','Created','Actions'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.id} style={{ 
                backgroundColor: alert.resolved ? '#f8f9fa' : '#fff3cd',
                fontWeight: alert.resolved ? 'normal' : 'bold'
              }}>
                <td>
                  <input 
                    type="text" 
                    value={alert.message} 
                    onChange={(e) => {
                      const updatedAlert = { ...alert, message: e.target.value }
                      updateAlert(updatedAlert)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                    style={{ 
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontWeight: 'inherit'
                    }}
                  />
                </td>
                <td>
                  <select 
                    value={alert.type} 
                    onChange={(e) => {
                      const updatedAlert = { ...alert, type: e.target.value }
                      updateAlert(updatedAlert)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                    style={{ 
                      color: getAlertTypeColor(alert.type),
                      fontWeight: 'bold'
                    }}
                  >
                    <option value="INFO">Info</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                    <option value="SUCCESS">Success</option>
                  </select>
                </td>
                <td>
                  <span style={{ 
                    color: alert.resolved ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {alert.resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                </td>
                <td>
                  {alert.timestamp ? new Date(alert.timestamp).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={() => alert.resolved ? markAsUnread(alert) : markAsRead(alert)}
                      style={{ 
                        backgroundColor: alert.resolved ? '#ffc107' : '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {alert.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                    </button>
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          Total Alerts: {alerts.length} | Unresolved: {unreadCount}
        </div>
      </div>
    </div>
  )
}

export default Alert
