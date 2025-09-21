import React, { useState, useEffect } from 'react';
import config from '../config';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.url}/users`);
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${config.url}/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        alert('Network error');
      }
    }
  };

  const styles = {
    container: {
      padding: '20px'
    },
    title: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
    },
    th: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      padding: '15px',
      textAlign: 'left',
      fontWeight: '600'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #eee'
    },
    tr: {
      transition: 'background-color 0.3s ease'
    },
    deleteBtn: {
      background: '#ff4757',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s ease'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#ff4757',
      background: '#ffe6e6',
      borderRadius: '8px',
      margin: '20px 0'
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Management</h2>
      
      {users.length === 0 ? (
        <div style={styles.empty}>No users found</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewUsers;
