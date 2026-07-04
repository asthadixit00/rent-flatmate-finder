import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function TenantProfile() {
  const [form, setForm] = useState({
    preferredLocation: '', budgetMin: '', budgetMax: '',
    moveInDate: '', roomType: 'any', furnishing: 'any'
  })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/tenant/profile').then(({ data }) => {
      setForm({
        preferredLocation: data.preferredLocation,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        moveInDate: data.moveInDate?.split('T')[0],
        roomType: data.roomType,
        furnishing: data.furnishing
      })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/tenant/profile', form)
      setMsg('Profile saved successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 550 }}>
      <div className="card">
        <h2>My Tenant Profile</h2>
        <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
          This profile is used to compute your compatibility score with listings.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Preferred Location</label>
            <input value={form.preferredLocation}
              onChange={e => setForm({ ...form, preferredLocation: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Min Budget (₹)</label>
              <input type="number" value={form.budgetMin}
                onChange={e => setForm({ ...form, budgetMin: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Max Budget (₹)</label>
              <input type="number" value={form.budgetMax}
                onChange={e => setForm({ ...form, budgetMax: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Move-in Date</label>
            <input type="date" value={form.moveInDate}
              onChange={e => setForm({ ...form, moveInDate: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Room Type Preference</label>
              <select value={form.roomType}
                onChange={e => setForm({ ...form, roomType: e.target.value })}>
                <option value="any">Any</option>
                <option value="single">Single</option>
                <option value="shared">Shared</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Furnishing Preference</label>
              <select value={form.furnishing}
                onChange={e => setForm({ ...form, furnishing: e.target.value })}>
                <option value="any">Any</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
          {msg && <p className="success">{msg}</p>}
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}