import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/staff', label: 'Staff', icon: '👷' },
  { path: '/packages', label: 'Paket Layanan', icon: '📦' },
  { path: '/orders', label: 'Pesanan', icon: '📋' },
  { path: '/schedules', label: 'Jadwal', icon: '📅' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">Cuci Mobil</h1>
          <p className="text-blue-300 text-sm">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm transition ${
                location.pathname === item.path
                  ? 'bg-blue-900 text-white border-r-4 border-white'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="text-sm text-blue-300 mb-2">{user?.name}</div>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-red-300 hover:text-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Page'}
          </h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
