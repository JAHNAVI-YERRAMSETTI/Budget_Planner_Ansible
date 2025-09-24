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
        let response = await fetch(`${config.url}/users/${userId}`, { method: 'DELETE' });
        if (!response.ok) {
          // Fallback: some environments block DELETE; use POST /delete
          response = await fetch(`${config.url}/users/${userId}/delete`, { method: 'POST' });
        }

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
      color: '#7c3aed', // violet, brand color
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(124,58,237,0.12)' // subtle shadow with violet tint
    },
    th: {
      background: '#d1c4e9', // light violet from userdashboard
      color: '#7c3aed', // brand violet
      padding: '15px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '16px',
      borderBottom: '2px solid #7c3aed' // brand violet
    },
    td: {
      padding: '14px',
      borderBottom: '1px solid #eee'
    },
    tr: {
      transition: 'background-color 0.3s ease'
    },
    deleteBtn: {
      background: '#6096fd', // accent blue from home actions
      color: 'white',
      border: 'none',
      padding: '8px 14px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      boxShadow: '0 2px 6px rgba(96,150,253,0.14)',
      transition: 'filter 0.3s ease'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#7c3aed' // violet for loading state
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#7c3aed', // violet, stays brand
      background: '#f3f0ff',
      borderRadius: '8px',
      margin: '20px 0'
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#7c3aed' // violet accent
    }
  }
;

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
