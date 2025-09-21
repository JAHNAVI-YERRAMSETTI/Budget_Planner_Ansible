import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const UserNavBar = ({ onLogout }) => {
  const navigate = useNavigate()

  const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'black', color: 'white' },
    brand: { fontWeight: 700 },
    links: { display: 'flex', gap: 12, listStyle: 'none', margin: 0, padding: 0 },
    link: ({ isActive }) => ({ color: 'white', padding: '6px 8px', borderRadius: 6, background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' }),
    right: { display: 'flex', alignItems: 'center', gap: 8 }
  }
  
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>My Budget</div>
      <ul style={styles.links}>
        <li><NavLink to="/user/dashboard" style={styles.link}>Dashboard</NavLink></li>
        <li><NavLink to="/user/budgets" style={styles.link}>Budgets</NavLink></li>
        <li><NavLink to="/user/expense" style={styles.link}>Expenses</NavLink></li>
        <li><NavLink to="/user/income" style={styles.link}>Income</NavLink></li>
        <li><NavLink to="/user/category" style={styles.link}>Categories</NavLink></li>
        <li><NavLink to="/user/transaction" style={styles.link}>Transactions</NavLink></li>
        <li><NavLink to="/user/retailer" style={styles.link}>Retailers</NavLink></li>
        <li><NavLink to="/user/analysis" style={styles.link}>Analysis</NavLink></li>
        <li><NavLink to="/user/monthly-report" style={styles.link}>Monthly Report</NavLink></li>
        <li><NavLink to="/user/alert" style={styles.link}>Alerts</NavLink></li>
        <li><NavLink to="/user/reports" style={styles.link}>Reports</NavLink></li>
        <li><NavLink to="/user/notifications" style={styles.link}>Notifications</NavLink></li>
      </ul>
      <div style={styles.right}>
        <button onClick={() => { onLogout(); navigate('/') }} style={{ color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', transition: 'filter 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>Logout</button>
      </div>
    </nav>
  )
}

export default UserNavBar
