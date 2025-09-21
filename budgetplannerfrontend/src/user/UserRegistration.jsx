import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import config from '../config'

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
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
      const response = await fetch(`${config.url}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log('Registration response:', responseData) // Debug log
      
      if (response.ok && responseData.status === 'success') {
        alert('Registration successful! Please login.')
        navigate('/user/login')
      } else {
        setError(responseData.message || 'Registration failed')
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
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>User Registration</h2>
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
              maxLength={50}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={50}
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
              maxLength={50}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          {error && <div style={{ color: 'black', marginBottom: 16, textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', marginBottom: 16 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p>Already have an account? <Link to="/user/login">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default UserRegistration
