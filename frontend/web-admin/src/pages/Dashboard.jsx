import { useState, useEffect } from 'react';
import { staffService, orderService, packageService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ staff: 0, orders: 0, packages: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, orderRes, packageRes] = await Promise.all([
          staffService.getAll(),
          orderService.getAll(),
          packageService.getAll(),
        ]);

        const orders = orderRes.data.orders || [];
        const revenue = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + parseFloat(o.total_price), 0);

        setStats({
          staff: staffRes.data.staff?.length || 0,
          orders: orders.length,
          packages: packageRes.data.packages?.length || 0,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const statCards = [
    { label: 'Total Staff', value: stats.staff, color: 'bg-blue-500' },
    { label: 'Total Pesanan', value: stats.orders, color: 'bg-green-500' },
    { label: 'Paket Layanan', value: stats.packages, color: 'bg-purple-500' },
    { label: 'Total Pendapatan', value: `Rp ${stats.revenue.toLocaleString('id-ID')}`, color: 'bg-yellow-500' },
  ];

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      on_the_way: 'bg-indigo-100 text-indigo-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl mb-4`}>
              {card.label === 'Total Staff' ? '👷' : card.label === 'Total Pesanan' ? '📋' : card.label === 'Paket Layanan' ? '📦' : '💰'}
            </div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Belum ada pesanan</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.user_name}</td>
                    <td className="px-6 py-4 text-sm">{order.package_name}</td>
                    <td className="px-6 py-4 text-sm">{order.order_date}</td>
                    <td className="px-6 py-4">{statusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-sm font-medium">Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
