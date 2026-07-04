import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreateListing() {
  const [form, setForm] = useState({
    title: '', location: '', rent: '', availableFrom: '',
    roomType: 'single', furnishing: 'furnished', description: ''
  })
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      photos.forEach(p => formData.append('photos', p))
      await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card">
        <h2>Create New Listing</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Location</label>
              <input value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Rent (₹/month)</label>
              <input type="number" value={form.rent}
                onChange={e => setForm({ ...form, rent: e.target.value })} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Available From</label>
              <input type="date" value={form.availableFrom}
                onChange={e => setForm({ ...form, availableFrom: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select value={form.roomType}
                onChange={e => setForm({ ...form, roomType: e.target.value })}>
                <option value="single">Single</option>
                <option value="shared">Shared</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Furnishing</label>
            <select value={form.furnishing}
              onChange={e => setForm({ ...form, furnishing: e.target.value })}>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Photos (up to 5)</label>
            <input type="file" accept="image/*" multiple
              onChange={e => setPhotos(Array.from(e.target.files))} />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Create Listing
          </button>
        </form>
      </div>
    </div>
  )
}