import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../models/service_package.dart';
import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<ServicePackage> _packages = [];
  bool _loading = true;
  String _selectedType = 'all';
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchPackages();
  }

  Future<void> _fetchPackages() async {
    try {
      final data = await ApiService.getPackages();
      setState(() {
        _packages = data.map((json) => ServicePackage.fromJson(json)).toList();
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  List<ServicePackage> get filteredPackages {
    if (_selectedType == 'all') return _packages;
    return _packages.where((p) => p.vehicleType == _selectedType).toList();
  }

  final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      body: SafeArea(
        child: _currentIndex == 0 ? _buildHome(user) : _currentIndex == 1 ? _buildOrders() : _buildProfile(user),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Beranda'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Pesanan'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }

  Widget _buildHome(user) {
    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.blue[700],
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Halo, ${user?.name ?? 'User'}!',
                style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Mau cuci kendaraan hari ini?',
                style: TextStyle(color: Colors.white70, fontSize: 14)),
            ],
          ),
        ),

        // Filter chips
        Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _filterChip('Semua', 'all'),
                _filterChip('Motor', 'motor'),
                _filterChip('Mobil Kecil', 'mobil_kecil'),
                _filterChip('Mobil Besar', 'mobil_besar'),
                _filterChip('SUV', 'suv'),
              ],
            ),
          ),
        ),

        // Package list
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _fetchPackages,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filteredPackages.length,
                    itemBuilder: (context, index) {
                      final pkg = filteredPackages[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: InkWell(
                          onTap: () => Navigator.pushNamed(context, '/order', arguments: pkg),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 56, height: 56,
                                  decoration: BoxDecoration(
                                    color: Colors.blue[50],
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(
                                    pkg.vehicleType == 'motor' ? Icons.two_wheeler : Icons.directions_car,
                                    color: Colors.blue[700], size: 28,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(pkg.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      const SizedBox(height: 4),
                                      Text(pkg.description ?? '', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(Icons.timer_outlined, size: 14, color: Colors.grey[500]),
                                          const SizedBox(width: 4),
                                          Text('${pkg.durationMinutes} menit', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  currencyFormat.format(pkg.price),
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green[700]),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
        ),
      ],
    );
  }

  Widget _filterChip(String label, String type) {
    final selected = _selectedType == type;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => setState(() => _selectedType = type),
        selectedColor: Colors.blue[100],
        checkmarkColor: Colors.blue[700],
      ),
    );
  }

  Widget _buildOrders() {
    return const OrdersTab();
  }

  Widget _buildProfile(user) {
    return ProfileTab(user: user);
  }
}

// ==================== ORDERS TAB ====================

class OrdersTab extends StatefulWidget {
  const OrdersTab({super.key});

  @override
  State<OrdersTab> createState() => _OrdersTabState();
}

class _OrdersTabState extends State<OrdersTab> {
  List<dynamic> _orders = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchOrders();
  }

  Future<void> _fetchOrders() async {
    try {
      final data = await ApiService.getOrders();
      setState(() { _orders = data; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'pending': return Colors.orange;
      case 'confirmed': return Colors.blue;
      case 'on_the_way': return Colors.indigo;
      case 'in_progress': return Colors.amber;
      case 'completed': return Colors.green;
      case 'cancelled': return Colors.red;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              const Text('Pesanan Saya', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              const Spacer(),
              IconButton(onPressed: _fetchOrders, icon: const Icon(Icons.refresh)),
            ],
          ),
        ),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : _orders.isEmpty
                  ? const Center(child: Text('Belum ada pesanan'))
                  : RefreshIndicator(
                      onRefresh: _fetchOrders,
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _orders.length,
                        itemBuilder: (context, index) {
                          final o = _orders[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: ListTile(
                              contentPadding: const EdgeInsets.all(16),
                              title: Text(o['package_name'] ?? 'Paket #${o['package_id']}',
                                style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 4),
                                  Text('${o['order_date']} - ${o['order_time']}'),
                                  const SizedBox(height: 4),
                                  Text(o['address'] ?? '', maxLines: 1, overflow: TextOverflow.ellipsis),
                                ],
                              ),
                              trailing: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: _statusColor(o['status']).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(o['status'], style: TextStyle(
                                      color: _statusColor(o['status']), fontSize: 12, fontWeight: FontWeight.bold)),
                                  ),
                                  const SizedBox(height: 4),
                                  Text('Rp ${NumberFormat('#,###', 'id_ID').format(double.parse(o['total_price'].toString()))}',
                                    style: const TextStyle(fontWeight: FontWeight.bold)),
                                ],
                              ),
                              onTap: () async {
                                final result = await Navigator.pushNamed(context, '/order-detail', arguments: o);
                                if (result == true) _fetchOrders();
                              },
                            ),
                          );
                        },
                      ),
                    ),
        ),
      ],
    );
  }
}

// ==================== PROFILE TAB ====================

class ProfileTab extends StatelessWidget {
  final dynamic user;
  const ProfileTab({super.key, this.user});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 20),
          CircleAvatar(
            radius: 50,
            backgroundColor: Colors.blue[100],
            child: Icon(Icons.person, size: 50, color: Colors.blue[700]),
          ),
          const SizedBox(height: 16),
          Text(user?.name ?? 'User', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(user?.email ?? '', style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 8),
          if (user?.phone != null) Text(user.phone, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),

          _menuItem(Icons.person_outline, 'Edit Profil', () {
            // TODO: navigate to edit profile
          }),
          _menuItem(Icons.history, 'Riwayat Pesanan', () {
            // Already on orders tab
          }),
          _menuItem(Icons.info_outline, 'Tentang Aplikasi', () {
            showAboutDialog(
              context: context,
              applicationName: 'Cuci Mobil Panggilan',
              applicationVersion: '1.0.0',
              children: [const Text('Aplikasi pemesanan jasa cuci kendaraan langsung ke rumah atau kantor.')],
            );
          }),

          const Spacer(),

          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                context.read<AuthProvider>().logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
              icon: const Icon(Icons.logout, color: Colors.red),
              label: const Text('Logout', style: TextStyle(color: Colors.red)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.red),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _menuItem(IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue[700]),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}
