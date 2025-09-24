import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const UserNavBar = ({ onLogout }) => {
  const navigate = useNavigate()

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '230px',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 8px 22px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: '22px 14px 14px 16px',
      justifyContent: 'flex-start'
    },
    brand: {
      fontWeight: 900,
      letterSpacing: 0.3,
      fontSize: '24px',
      marginBottom: '24px',
      marginLeft: '4px'
    },
    links: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      listStyle: 'none',
      margin: 0,
      padding: 0,
      flex: 1
    },
    link: ({ isActive }) => ({
      color: '#fff',
      padding: '10px 16px',
      borderRadius: 10,
      marginBottom: '2px',
      background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
      border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
      display: 'block',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'background 0.2s'
    }),
    logoutWrapper: {
      paddingTop: '8px',
      display: 'flex',
      justifyContent: 'center'
    },
    logoutBtn: {
      color: '#fff',
      background: 'rgba(255,255,255,0.16)',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: 10,
      padding: '8px 22px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'filter 0.2s ease'
    }
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
        <li>
          <div style={styles.logoutWrapper}>
            <button 
              style={styles.logoutBtn}
              onClick={() => { onLogout(); navigate('/') }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.07)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default UserNavBar
