import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Retailer = () => {
  const navigate = useNavigate()
  const [retailers, setRetailers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [name, setName] = useState('')
  const [defaultCategory, setDefaultCategory] = useState('')
  const [description, setDescription] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Load retailers
        const retailersResponse = await fetch(`${config.url}/retailers`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (retailersResponse.ok) {
          const retailersData = await retailersResponse.json()
          if (mounted) setRetailers(retailersData)
        }

        // Load categories
        const categoriesResponse = await fetch(`${config.url}/categories`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (mounted) setCategories(categoriesData)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user.id])

  const addRetailer = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${config.url}/retailers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          defaultCategory,
          description
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add retailer result:', result)
      setSuccessMessage('Retailer added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload retailers
      const retailersResponse = await fetch(`${config.url}/retailers`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (retailersResponse.ok) {
        const retailersData = await retailersResponse.json()
        setRetailers(retailersData)
      }
      
      // Reset form
      setName('')
      setDefaultCategory('')
      setDescription('')
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateRetailer = async (retailer) => {
    try {
      const response = await fetch(`${config.url}/retailers/${retailer.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(retailer)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update retailer result:', result)
      
      // Reload retailers
      const retailersResponse = await fetch(`${config.url}/retailers`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (retailersResponse.ok) {
        const retailersData = await retailersResponse.json()
        setRetailers(retailersData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteRetailer = async (retailerId) => {
    try {
      const response = await fetch(`${config.url}/retailers/${retailerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete retailer result:', result)
      
      // Reload retailers
      const retailersResponse = await fetch(`${config.url}/retailers`, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      })
      if (retailersResponse.ok) {
        const retailersData = await retailersResponse.json()
        setRetailers(retailersData)
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
        <h2>Retailers</h2>
        
        <form onSubmit={addRetailer} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Retailer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <input 
              placeholder="Retailer Name" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <select 
              value={defaultCategory} 
              onChange={(e) => setDefaultCategory(e.target.value)}
            >
              <option value="">Select Default Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="submit">Add Retailer</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Default Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {retailers.map(retailer => (
              <tr key={retailer.id}>
                <td>
                  <input 
                    type="text" 
                    value={retailer.name} 
                    onChange={(e) => {
                      const updatedRetailer = { ...retailer, name: e.target.value }
                      updateRetailer(updatedRetailer)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={retailer.description || ''} 
                    onChange={(e) => {
                      const updatedRetailer = { ...retailer, description: e.target.value }
                      updateRetailer(updatedRetailer)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td>
                  <select 
                    value={retailer.defaultCategory || ''} 
                    onChange={(e) => {
                      const updatedRetailer = { ...retailer, defaultCategory: e.target.value }
                      updateRetailer(updatedRetailer)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  >
                    <option value="">No Default Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => deleteRetailer(retailer.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          Total Retailers: {retailers.length}
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>Retailer Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
            {retailers.map(retailer => (
              <div key={retailer.id} style={{ 
                padding: 12, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 8, 
                border: '1px solid #dee2e6'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{retailer.name}</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  Default: {retailer.defaultCategory || 'None'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Retailer
