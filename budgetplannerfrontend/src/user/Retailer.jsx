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
      <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
        <h2>Retailers</h2>
        
        <form onSubmit={addRetailer} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
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
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
            }}>Add Retailer</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <thead>
            <tr>
              {['Name','Description','Default Category','Actions'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retailers.map(retailer => (
              <tr key={retailer.id}>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
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
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
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
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
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
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <button 
                    onClick={() => deleteRetailer(retailer.id)}
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 10, cursor: 'pointer' }}
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
