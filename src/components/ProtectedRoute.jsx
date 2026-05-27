import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function ProtectedRoute({ children }) {
  const { pseudo } = useUser()
  return pseudo ? children : <Navigate to="/" replace />
}

export default ProtectedRoute
