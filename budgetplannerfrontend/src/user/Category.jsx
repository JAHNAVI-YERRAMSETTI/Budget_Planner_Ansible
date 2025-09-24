import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Category = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [name, setName] = useState('')

  // Categories are automatically initialized by backend DataInitializer

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        
        // Get user data and check ID
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.userId || user.user_id;
        const token = localStorage.getItem('token') || '';
        
        if (!userId) {
          setError('User not logged in properly. Please login again.');
          return;
        }
        
        const response = await fetch(`${config.url}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) {
          setCategories(data)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])


  const addCategory = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          name
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Add category result:', result)
      setSuccessMessage('Category added successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Reload categories
      const addCategoriesResponse = await fetch(`${config.url}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (addCategoriesResponse.ok) {
        const categoriesData = await addCategoriesResponse.json()
        setCategories(categoriesData)
      }
      
      // Reset form
      setName('')
      
    } catch (e) {
      setError(String(e.message || e))
      setSuccessMessage('')
    }
  }

  const updateCategory = async (category) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(category)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Update category result:', result)
      
      // Reload categories
      const updateCategoriesResponse = await fetch(`${config.url}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (updateCategoriesResponse.ok) {
        const categoriesData = await updateCategoriesResponse.json()
        setCategories(categoriesData)
      }
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${config.url}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.text()
      console.log('Delete category result:', result)
      
      // Reload categories
      const deleteCategoriesResponse = await fetch(`${config.url}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (deleteCategoriesResponse.ok) {
        const categoriesData = await deleteCategoriesResponse.json()
        setCategories(categoriesData)
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
        <h2>Categories</h2>
        
        <form onSubmit={addCategory} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <h3>Add Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <input 
              placeholder="Category Name" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <button type="submit" style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)'
            }}>Add Category</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

        <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
          <thead>
            <tr>
              {['Name','Actions'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <input 
                    type="text" 
                    value={category.name} 
                    onChange={(e) => {
                      const updatedCategory = { ...category, name: e.target.value }
                      updateCategory(updatedCategory)
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} 
                    onBlur={(e) => (e.currentTarget.style.outline = 'none')} 
                  />
                </td>
                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                  <button 
                    onClick={() => deleteCategory(category.id)}
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
          Total Categories: {categories.length}
        </div>
      </div>
    </div>
  )
}

export default Category