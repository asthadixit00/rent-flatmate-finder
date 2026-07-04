import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [score, setScore] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`)
        setListing(data)
        if (user?.role === 'tenant') {
          try {
            const scoreRes = await api.get(`/compatibility/${id}`)
            setScore(scoreRes.data)
          } catch {}
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleInterest = async () => {
    try {
      await api.post(`/interest/${id}`)
      setMsg('Interest request sent successfully!')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send interest')
    }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (!listing) return <div className="container"><p>Listing not found.</p></div>

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="card">
        {listing.photos?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {listing.photos.map((p, i) => (
              <img key={i} src={p} alt="" style={{ width: 180, height: 130, objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </div>
        )}
        <h1>{listing.title}</h1>
        <p>📍 {listing.location}</p>
        <p>💰 ₹{listing.rent}/month</p>
        <p>🛏 {listing.roomType} | {listing.furnishing}</p>
        <p>📅 Available from: {new Date(listing.availableFrom).toLocaleDateString()}</p>
        {listing.description && <p style={{ marginTop: '0.8rem' }}>{listing.description}</p>}
        <p style={{ marginTop: '0.5rem', color: '#888' }}>
          Posted by: {listing.owner?.name}
        </p>

        {score && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Your Compatibility Score</h3>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${score.score}%` }} />
            </div>
            <p><strong>{score.score}/100</strong> — {score.explanation}</p>
            <span className="badge badge-blue" style={{ marginTop: '0.3rem' }}>
              Scored via {score.method === 'ai' ? 'AI' : 'Rule-based fallback'}
            </span>
          </div>
        )}

        {user?.role === 'tenant' && !listing.isFilled && (
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-success" onClick={handleInterest}>
              Send Interest Request
            </button>
            {msg && <p style={{ marginTop: '0.5rem' }} className={msg.includes('success') ? 'success' : 'error'}>{msg}</p>}
          </div>
        )}

        {listing.isFilled && (
          <p className="badge badge-red" style={{ marginTop: '1rem' }}>This listing is filled</p>
        )}
      </div>
    </div>
  )
}