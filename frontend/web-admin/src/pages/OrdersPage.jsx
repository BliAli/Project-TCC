import { useState, useEffect } from 'react';
import { orderService, staffService } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateForm, setUpdateForm] = useState({ staff_id: '', status: '' });

  const fetchData = async () => {
    try {
      const [orderRes, staffRes] = await Promise.all([
        orderService.getAll(),
        staffService.getAll(),
      ]);
      setOrders(orderRes.data.orders || []);
      setStaffList(staffRes.data.staff || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openUpdate = (order) => {
    setSelectedOrder(order);
    setUpdateForm({ staff_id: order.staff_id || '', status: order.status });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await orderService.update(selectedOrder.id, updateForm);
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengupdate order');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    try {
      await orderService.delete(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membatalkan order');
    }
  };

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      on_the_way: 'bg-indigo-100 text-indigo-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Daftar Pesanan ({orders.length})</h3>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr><td colSpan="9" className="px-6 py-4 text-center text-gray-500">Belum ada pesanan</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.user_name}</td>
                  <td className="px-6 py-4 text-sm">{order.package_name}</td>
                  <td className="px-6 py-4 text-sm">{order.staff_name || <span className="text-gray-400">Belum ditugaskan</span>}</td>
                  <td className="px-6 py-4 text-sm">{order.order_date}</td>
                  <td className="px-6 py-4 text-sm">{order.order_time}</td>
                  <td className="px-6 py-4">{statusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-sm font-medium">Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => openUpdate(order)} className="text-blue-600 hover:underline">Update</button>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button onClick={() => handleCancel(order.id)} className="text-red-600 hover:underline">Batal</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Update */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Pesanan #{selectedOrder.id}</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Staff</label>
                <select value={updateForm.staff_id} onChange={(e) => setUpdateForm({ ...updateForm, staff_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">-- Pilih Staff --</option>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.status})</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                <p><strong>Pelanggan:</strong> {selectedOrder.user_name}</p>
                <p><strong>Alamat:</strong> {selectedOrder.address}</p>
                <p><strong>Paket:</strong> {selectedOrder.package_name}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
