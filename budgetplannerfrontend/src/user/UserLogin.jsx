import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import config from '../config'

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${config.url}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('Login response:', responseData) // Debug log
        
        // Extract user data from the response structure
        if (responseData.status === 'success' && responseData.user) {
          const user = responseData.user
          console.log('Extracted user data:', user) // Debug log
          
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('userType', 'user')
          
          // Store token if available (backend doesn't provide token yet)
          if (user.token) {
            localStorage.setItem('token', user.token)
          }
          
          navigate('/user/dashboard')
        } else {
          setError(responseData.message || 'Login failed')
        }
      } else {
        const errorMessage = await response.text()
        setError(errorMessage || 'Invalid Username or Password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 460,
        position: 'relative',
      }}>
        {/* Glow border like Home hero card */}
        <div style={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          background: 'linear-gradient(45deg, #ffffff, #f8f9ff, #e8f0ff)',
          borderRadius: 24,
          opacity: 0.3,
          filter: 'blur(8px)'
        }} />

        <div style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 35px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
          borderRadius: 24,
          padding: '28px 26px',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" fill="#ffffff" opacity="0.9"/>
              <path d="M3 22a9 9 0 1118 0" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
            </svg>
            {/* Gradient text like Home */}
            <h2 style={{
              margin: 0,
              fontWeight: 900,
              fontSize: '1.6rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #e8f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>User Login</h2>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', marginTop: 0, marginBottom: 20 }}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="username" style={{ color: 'white', fontWeight: 700 }}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                maxLength={50}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                onFocus={(e)=>{e.target.style.border='1px solid #fff'; e.target.style.background='rgba(255,255,255,0.22)'}}
                onBlur={(e)=>{e.target.style.border='1px solid rgba(255,255,255,0.35)'; e.target.style.background='rgba(255,255,255,0.15)'}}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label htmlFor="password" style={{ color: 'white', fontWeight: 700 }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                maxLength={50}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s'
                }}
                onFocus={(e)=>{e.target.style.border='1px solid #fff'; e.target.style.background='rgba(255,255,255,0.22)'}}
                onBlur={(e)=>{e.target.style.border='1px solid rgba(255,255,255,0.35)'; e.target.style.background='rgba(255,255,255,0.15)'}}
              />
            </div>

            {error && <div style={{ background:'rgba(255,255,255,0.15)', color: '#fff', border:'1px solid rgba(255,255,255,0.35)', padding: 10, borderRadius: 10, marginBottom: 14, textAlign: 'center' }}>{error}</div>}

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(102,126,234,0.35)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseOver={(e)=>{e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 16px 30px rgba(118,75,162,0.45)'}}
              onMouseOut={(e)=>{e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 10px 24px rgba(102,126,234,0.35)'}}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Don't have an account? <Link to="/user/register" style={{ color:'#fff', fontWeight:800, textDecoration:'none', borderBottom:'1px dashed rgba(255,255,255,0.8)' }}>Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
