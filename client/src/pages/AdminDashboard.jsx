import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {})
    api.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => {})
  }, [])

  const toggleUser = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle`)
      setMsg(data.message)
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch {}
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      {msg && <p className="success" style={{ marginBottom: '1rem' }}>{msg}</p>}

      {stats && (
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card"><h2>{stats.totalUsers}</h2><p>Total Users</p></div>
          <div className="stat-card"><h2>{stats.totalListings}</h2><p>Total Listings</p></div>
          <div className="stat-card"><h2>{stats.activeListings}</h2><p>Active Listings</p></div>
        </div>
      )}

      <h2>Manage Users</h2>
      {users.map(u => (
        <div className="card" key={u._id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p><strong>{u.name}</strong> — {u.email}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Role: {u.role}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                {u.isActive ? 'Active' : 'Deactivated'}
              </span>
              <button
                className={`btn ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                style={{ fontSize: '0.8rem' }}
                onClick={() => toggleUser(u._id)}>
                {u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}