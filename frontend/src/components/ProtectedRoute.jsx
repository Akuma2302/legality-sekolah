import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireRole }) {
  const { loading, session, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <p className="text-navy-300 text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (requireRole && role !== requireRole) {
    // Signed in but wrong role — send them to their own portal
    return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  }

  return children;
}
