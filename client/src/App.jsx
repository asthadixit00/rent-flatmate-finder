import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import TenantProfile from './pages/TenantProfile'
import TenantRequests from './pages/TenantRequests'
import OwnerDashboard from './pages/OwnerDashboard'
import CreateListing from './pages/CreateListing'
import Chat from './pages/Chat'
import AdminDashboard from './pages/AdminDashboard'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'owner' ? '/owner/dashboard' : user.role === 'admin' ? '/admin' : '/listings'} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/tenant/profile" element={<ProtectedRoute roles={['tenant']}><TenantProfile /></ProtectedRoute>} />
        <Route path="/tenant/requests" element={<ProtectedRoute roles={['tenant']}><TenantRequests /></ProtectedRoute>} />
        <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/create-listing" element={<ProtectedRoute roles={['owner']}><CreateListing /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute roles={['owner', 'tenant']}><Chat /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}