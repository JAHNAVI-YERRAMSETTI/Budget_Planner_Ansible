import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const AdminLogin = () => {
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
      const response = await fetch(`${config.url}/admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const admin = await response.json()
        localStorage.setItem('admin', JSON.stringify(admin))
        localStorage.setItem('userType', 'admin')
        navigate('/admin/dashboard')
      } else {
        const errorMessage = await response.text()
        setError(errorMessage || 'Invalid credentials')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          {error && <div style={{ color: 'black', marginBottom: 16, textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
