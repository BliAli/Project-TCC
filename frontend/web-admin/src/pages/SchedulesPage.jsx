import { useState, useEffect } from 'react';
import { scheduleService, staffService } from '../services/api';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ staff_id: '', date: '', start_time: '', end_time: '' });

  const fetchData = async () => {
    try {
      const [scheduleRes, staffRes] = await Promise.all([
        scheduleService.getAll(),
        staffService.getAll(),
      ]);
      setSchedules(scheduleRes.data.schedules || []);
      setStaffList(staffRes.data.staff || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleService.create(form);
      setShowModal(false);
      setForm({ staff_id: '', date: '', start_time: '', end_time: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat jadwal');
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Jadwal Staff ({schedules.length})</h3>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mulai</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selesai</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tersedia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Belum ada jadwal</td></tr>
            ) : (
              schedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{sch.staff_name}</td>
                  <td className="px-6 py-4 text-sm">{new Date(sch.date).toLocaleDateString()}</td>
                  // merubah format waktu dari "HH:mm:ss" menjadi "HH:mm"
                  <td className="px-6 py-4 text-sm">{sch.start_time.substring(0, 5)}</td>
                  <td className="px-6 py-4 text-sm">{sch.end_time.substring(0, 5)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sch.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sch.is_available ? 'Ya' : 'Tidak'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tambah Jadwal</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                <select value={form.staff_id} onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
                  <option value="">-- Pilih Staff --</option>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                  <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                  <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
