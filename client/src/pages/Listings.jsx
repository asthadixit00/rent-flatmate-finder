import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [filters, setFilters] = useState({ location: '', minBudget: '', maxBudget: '' })
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    try {
      const params = {}
      if (filters.location) params.location = filters.location
      if (filters.minBudget) params.minBudget = filters.minBudget
      if (filters.maxBudget) params.maxBudget = filters.maxBudget
      const { data } = await api.get('/listings', { params })
      setListings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  return (
    <div className="container">
      <div className="page-header">
        <h1>Browse Listings</h1>
      </div>
      <div className="filters">
        <input placeholder="Search by location..."
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })} />
        <input type="number" placeholder="Min Budget"
          value={filters.minBudget}
          onChange={e => setFilters({ ...filters, minBudget: e.target.value })} />
        <input type="number" placeholder="Max Budget"
          value={filters.maxBudget}
          onChange={e => setFilters({ ...filters, maxBudget: e.target.value })} />
        
        <button className="btn btn-secondary" onClick={() => {
  setFilters({ location: '', minBudget: '', maxBudget: '' })
  setTimeout(fetchListings, 100)
}}>Reset</button>
      </div>

      {loading ? <p>Loading listings...</p> : (
        <div className="grid-3">
          {listings.length === 0 ? <p>No listings found.</p> : listings.map(listing => (
            <div className="card" key={listing._id}>
              {listing.photos?.[0] && (
                <img src={listing.photos[0]} alt={listing.title} className="listing-photo" />
              )}
              <h3>{listing.title}</h3>
              <p>📍 {listing.location}</p>
              <p>💰 ₹{listing.rent}/month</p>
              <p>🛏 {listing.roomType} | {listing.furnishing}</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>
                Available from: {new Date(listing.availableFrom).toLocaleDateString()}
              </p>
              <Link to={`/listings/${listing._id}`}>
                <button className="btn btn-primary" style={{ marginTop: '0.8rem', width: '100%' }}>
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}