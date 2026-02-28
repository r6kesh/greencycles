import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Pricing from './pages/Pricing';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bgDark text-white font-sans flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-bgDark-card border-b border-white/10 p-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold font-outfit uppercase tracking-widest text-primary">Admin</h1>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/pricing" element={<Pricing />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
