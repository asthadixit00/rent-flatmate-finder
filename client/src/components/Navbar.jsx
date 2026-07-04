import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/" className="nav-brand">🏠 Rent & Flatmate Finder</Link>
      <div>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {user.role === 'tenant' && (
              <>
                <Link to="/listings">Listings</Link>
                <Link to="/tenant/profile">My Profile</Link>
                <Link to="/tenant/requests">My Requests</Link>
                <Link to="/chat">Chat</Link>
              </>
            )}
            {user.role === 'owner' && (
              <>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/chat">Chat</Link>
              </>
            )}
            {user.role === 'admin' && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <span style={{ color: '#aaa', marginLeft: '1rem' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}
              style={{ marginLeft: '1rem', background: 'transparent', border: '1px solid #aaa', color: 'white', padding: '0.3rem 0.8rem', borderRadius: 4, cursor: 'pointer' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}