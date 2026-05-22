import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class OrderDetailScreen extends StatefulWidget {
  const OrderDetailScreen({super.key});

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  Map<String, dynamic>? _order;
  bool _loading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    _fetchDetail(args['id']);
  }

  Future<void> _fetchDetail(int id) async {
    try {
      final data = await ApiService.getOrderDetail(id);
      setState(() { _order = data['order']; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  Future<void> _cancelOrder() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Batalkan Pesanan?'),
        content: const Text('Pesanan yang dibatalkan tidak bisa dikembalikan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Tidak')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Ya, Batalkan', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirm != true) return;

    await ApiService.cancelOrder(_order!['id']);
    if (mounted) {
      Navigator.pop(context, true);
    }
  }

  void _showRatingDialog() {
    double rating = 5;
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Beri Rating'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Staff: ${_order!['staff_name'] ?? 'Unknown'}'),
            const SizedBox(height: 16),
            RatingBar.builder(
              initialRating: 5,
              minRating: 1,
              direction: Axis.horizontal,
              allowHalfRating: false,
              itemCount: 5,
              itemSize: 36,
              itemBuilder: (context, _) => const Icon(Icons.star, color: Colors.amber),
              onRatingUpdate: (r) => rating = r,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: commentController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Komentar (opsional)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              await ApiService.submitRating(
                orderId: _order!['id'],
                staffId: _order!['staff_id'],
                score: rating.toInt(),
                comment: commentController.text.isNotEmpty ? commentController.text : null,
              );
              if (ctx.mounted) Navigator.pop(ctx);
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Rating berhasil diberikan!'), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text('Kirim'),
          ),
        ],
      ),
    );
  }

  void _openChat() {
    Navigator.pushNamed(context, '/chat', arguments: _order);
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'pending': return Colors.orange;
      case 'confirmed': return Colors.blue;
      case 'on_the_way': return Colors.indigo;
      case 'in_progress': return Colors.amber[700]!;
      case 'completed': return Colors.green;
      case 'cancelled': return Colors.red;
      default: return Colors.grey;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'confirmed': return 'Dikonfirmasi';
      case 'on_the_way': return 'Staff Dalam Perjalanan';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'pending': return Icons.hourglass_top;
      case 'confirmed': return Icons.check_circle_outline;
      case 'on_the_way': return Icons.directions_car;
      case 'in_progress': return Icons.local_car_wash;
      case 'completed': return Icons.done_all;
      case 'cancelled': return Icons.cancel;
      default: return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_order != null ? 'Pesanan #${_order!['id']}' : 'Detail Pesanan'), centerTitle: true),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _order == null
              ? const Center(child: Text('Pesanan tidak ditemukan'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status card
                      Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        color: _statusColor(_order!['status']).withOpacity(0.1),
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Row(
                            children: [
                              Icon(_statusIcon(_order!['status']), size: 40, color: _statusColor(_order!['status'])),
                              const SizedBox(width: 16),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Status Pesanan', style: TextStyle(color: Colors.grey, fontSize: 12)),
                                  Text(_statusLabel(_order!['status']),
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: _statusColor(_order!['status']))),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Details
                      _infoSection('Paket', _order!['package_name'] ?? '-'),
                      _infoSection('Tanggal', '${_order!['order_date']} - ${_order!['order_time']}'),
                      _infoSection('Alamat', _order!['address'] ?? '-'),
                      _infoSection('Staff', _order!['staff_name'] ?? 'Belum ditugaskan'),
                      if (_order!['vehicle_plate'] != null) _infoSection('Plat Nomor', _order!['vehicle_plate']),
                      if (_order!['notes'] != null) _infoSection('Catatan', _order!['notes']),
                      _infoSection('Total', 'Rp ${NumberFormat('#,###', 'id_ID').format(double.parse(_order!['total_price'].toString()))}'),

                      const SizedBox(height: 24),

                      // Action buttons
                      if (_order!['status'] == 'pending' || _order!['status'] == 'confirmed')
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _cancelOrder,
                            icon: const Icon(Icons.cancel, color: Colors.red),
                            label: const Text('Batalkan Pesanan', style: TextStyle(color: Colors.red)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Colors.red),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),

                      if (_order!['status'] == 'on_the_way' || _order!['status'] == 'in_progress') ...[
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _openChat,
                            icon: const Icon(Icons.chat),
                            label: const Text('Chat dengan Staff'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue[700],
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],

                      if (_order!['status'] == 'completed' && _order!['staff_id'] != null) ...[
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _showRatingDialog,
                            icon: const Icon(Icons.star),
                            label: const Text('Beri Rating'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.amber[700],
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _infoSection(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 100, child: Text(label, style: TextStyle(color: Colors.grey[600]))),
          Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500))),
        ],
      ),
    );
  }
}
