import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const AdminNavBar = ({ onLogout }) => {
  const navigate = useNavigate()

  const styles = {
    nav: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
      boxShadow: '0 8px 22px rgba(0,0,0,0.15)'
    },
    brand: { fontWeight: 900, letterSpacing: 0.3 },
    links: { display: 'flex', gap: 12, listStyle: 'none', margin: 0, padding: 0 },
    link: ({ isActive }) => ({
      color: '#fff', padding: '6px 10px', borderRadius: 10,
      background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
      border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent'
    }),
    right: { display: 'flex', alignItems: 'center', gap: 8 }
  }
  
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Admin Panel</div>
      <ul style={styles.links}>
        <li><NavLink to="/admin/dashboard" style={styles.link}>Dashboard</NavLink></li>
      </ul>
      <div style={styles.right}>
        <button onClick={() => { onLogout(); navigate('/') }} style={{ color: '#fff', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', transition: 'filter 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>Logout</button>
      </div>
    </nav>
  )
}

export default AdminNavBar
