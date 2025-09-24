import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import ViewUsers from './ViewUsers'
import config from '../config'

const AdminHome = () => {
  const [admin, setAdmin] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 })

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  useEffect(() => {
    async function loadStats() {
      try {
        const usersRes = await fetch(`${config.url}/users`)
        const users = usersRes.ok ? await usersRes.json() : []
        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          activeUsers: Array.isArray(users) ? users.length : 0
        })
      } catch  {
        // keep zeros on error
      }
    }
    loadStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('userType')
    navigate('/admin/login')
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <ViewUsers />
      case 'dashboard':
      default:
        return (
          <div>
            {/* Welcome Card - placed first */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,16,64,0.06)',
              padding: '28px 22px 18px 22px',
              marginBottom: '24px',
            }}>
              <h2 style={{
                marginTop: 0,
                marginBottom: '10px',
                color: '#7c3aed',  // matches summary heading color
                fontWeight: 'bold',
                fontSize: '24px',
                letterSpacing: '0.02em'
              }}>
                Admin Dashboard
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#192a56',
                margin: 0,
              }}>
                Welcome to the admin panel. Use the tabs above to manage different aspects of the system.
              </p>
            </div>

            {/* Summary heading */}
            <h3 style={{ color: '#7c3aed', marginBottom: '16px' }}>Admin Dashboard Summary</h3>

            {/* Stats Table */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(124,58,237,0.12)',
              marginBottom: 24,
            }}>
              <thead>
                <tr style={{ backgroundColor: '#d1c4e9', borderBottom: '2px solid #7c3aed' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#7c3aed', fontWeight: 'bold' }}>Metric</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#7c3aed', fontWeight: 'bold' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '14px' }}>Total Users</td>
                  <td style={{ padding: '14px' }}>{stats.totalUsers}</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px' }}>Active Users</td>
                  <td style={{ padding: '14px' }}>{stats.activeUsers}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
    }
  }

  return (
    <div>
      <AdminNavBar onLogout={handleLogout} />
      <div className="container" style={{ padding: 16, background: '#ffffff' }}>
        {/* Removed previous welcome card here to avoid duplication */}

        <div className="card" style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '16px 16px',
          color: '#0f172a',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)'
        }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #10B981, #059669)' : '#f1f5f9',
                color: activeTab === 'dashboard' ? 'white' : '#0f172a'
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: activeTab === 'users' ? 'linear-gradient(135deg, #10B981, #059669)' : '#f1f5f9',
                color: activeTab === 'users' ? 'white' : '#0f172a'
              }}
              onClick={() => setActiveTab('users')}
            >
              Manage Users
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminHome
