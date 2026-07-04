import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function TenantRequests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    api.get('/interest/tenant/requests').then(({ data }) => setRequests(data)).catch(() => {})
  }, [])

  return (
    <div className="container">
      <h1>My Interest Requests</h1>
      {requests.length === 0 ? <p>No requests sent yet.</p> : requests.map(r => (
        <div className="card" key={r._id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{r.listing?.title}</h3>
              <p>📍 {r.listing?.location} | 💰 ₹{r.listing?.rent}/month</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Owner: {r.owner?.name}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${r.status === 'accepted' ? 'badge-green' : r.status === 'declined' ? 'badge-red' : 'badge-yellow'}`}>
                {r.status}
              </span>
              {r.status === 'accepted' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Link to="/chat">
                    <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Open Chat</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}