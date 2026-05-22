import { useState, useEffect } from 'react';
import { packageService } from '../services/api';

const vehicleTypes = [
  { value: 'motor', label: 'Motor' },
  { value: 'mobil_kecil', label: 'Mobil Kecil' },
  { value: 'mobil_besar', label: 'Mobil Besar' },
  { value: 'suv', label: 'SUV' },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', vehicle_type: 'motor', price: '', duration_minutes: '' });

  const fetchPackages = async () => {
    try {
      const res = await packageService.getAll();
      setPackages(res.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const openCreate = () => {
    setEditingPkg(null);
    setForm({ name: '', description: '', vehicle_type: 'motor', price: '', duration_minutes: '' });
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditingPkg(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      vehicle_type: pkg.vehicle_type,
      price: pkg.price,
      duration_minutes: pkg.duration_minutes,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPkg) {
        await packageService.update(editingPkg.id, form);
      } else {
        await packageService.create(form);
      }
      setShowModal(false);
      fetchPackages();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus paket ini?')) return;
    try {
      await packageService.delete(id);
      fetchPackages();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus paket');
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Paket Layanan ({packages.length})</h3>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Tambah Paket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg">{pkg.name}</h4>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {vehicleTypes.find(v => v.value === pkg.vehicle_type)?.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{pkg.description || 'Tidak ada deskripsi'}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-green-600">Rp {parseFloat(pkg.price).toLocaleString('id-ID')}</span>
              <span className="text-sm text-gray-500">{pkg.duration_minutes} menit</span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => openEdit(pkg)} className="flex-1 text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm">Edit</button>
              <button onClick={() => handleDelete(pkg.id)} className="flex-1 text-center py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingPkg ? 'Edit Paket' : 'Tambah Paket'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" rows="2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kendaraan</label>
                <select value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  {vehicleTypes.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
                  <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
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
