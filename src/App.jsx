import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Shop from './pages/Shop';
import Ranking from './pages/Ranking';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTournaments from './pages/admin/AdminTournaments';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStats from './pages/admin/AdminStats';
import AdminLayout from './components/layout/AdminLayout';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen" style={{ color: '#8B0000' }}>Cargando...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen" style={{ color: '#8B0000' }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/profile" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="tournaments" element={<Tournaments />} />
            <Route path="tournaments/:id" element={<TournamentDetail />} />
            <Route path="ranking" element={<Ranking />} />
            {/* Protected */}
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="shop" element={<PrivateRoute><Shop /></PrivateRoute>} />
          </Route>
          {/* Admin Panel */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="stats" element={<AdminStats />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
