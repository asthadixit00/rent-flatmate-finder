import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function OwnerDashboard() {
  const [listings, setListings] = useState([])
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/listings/my').then(({ data }) => setListings(data)).catch(() => {})
    api.get('/interest/owner/requests').then(({ data }) => setRequests(data)).catch(() => {})
  }, [])

  const handleRespond = async (id, status) => {
    try {
      await api.patch(`/interest/${id}/respond`, { status })
      setMsg(`Request ${status} successfully`)
      const { data } = await api.get('/interest/owner/requests')
      setRequests(data)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed')
    }
  }

  const handleMarkFilled = async (id) => {
    try {
      await api.patch(`/listings/${id}/fill`)
      const { data } = await api.get('/listings/my')
      setListings(data)
    } catch {}
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Owner Dashboard</h1>
        <Link to="/owner/create-listing">
          <button className="btn btn-primary">+ New Listing</button>
        </Link>
      </div>

      {msg && <p className="success" style={{ marginBottom: '1rem' }}>{msg}</p>}

      <h2>My Listings</h2>
      {listings.length === 0 ? <p style={{ marginBottom: '1.5rem' }}>No listings yet.</p> : (
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {listings.map(l => (
            <div className="card" key={l._id}>
              <h3>{l.title}</h3>
              <p>📍 {l.location} | 💰 ₹{l.rent}</p>
              <p>
                {l.isFilled
                  ? <span className="badge badge-red">Filled</span>
                  : <span className="badge badge-green">Available</span>}
              </p>
              {!l.isFilled && (
                <button className="btn btn-secondary"
                  style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
                  onClick={() => handleMarkFilled(l._id)}>
                  Mark as Filled
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <h2>Interest Requests</h2>
      {requests.length === 0 ? <p>No interest requests yet.</p> : requests.map(r => (
        <div className="card" key={r._id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p><strong>{r.tenant?.name}</strong> interested in <strong>{r.listing?.title}</strong></p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Score: {r.compatibilityScore}/100 | ₹{r.listing?.rent}/month
              </p>
            </div>
            <div>
              {r.status === 'pending' ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-success" onClick={() => handleRespond(r._id, 'accepted')}>Accept</button>
                  <button className="btn btn-danger" onClick={() => handleRespond(r._id, 'declined')}>Decline</button>
                </div>
              ) : (
                <span className={`badge ${r.status === 'accepted' ? 'badge-green' : 'badge-red'}`}>
                  {r.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}