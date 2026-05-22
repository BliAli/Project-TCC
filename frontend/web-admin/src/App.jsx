import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffPage from './pages/StaffPage';
import PackagesPage from './pages/PackagesPage';
import OrdersPage from './pages/OrdersPage';
import SchedulesPage from './pages/SchedulesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="schedules" element={<SchedulesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
