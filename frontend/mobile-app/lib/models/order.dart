class Order {
  final int id;
  final int userId;
  final int? staffId;
  final int packageId;
  final String orderDate;
  final String orderTime;
  final String address;
  final double? latitude;
  final double? longitude;
  final String? vehiclePlate;
  final String status;
  final double totalPrice;
  final String? notes;
  final String? userName;
  final String? staffName;
  final String? packageName;

  Order({
    required this.id,
    required this.userId,
    this.staffId,
    required this.packageId,
    required this.orderDate,
    required this.orderTime,
    required this.address,
    this.latitude,
    this.longitude,
    this.vehiclePlate,
    required this.status,
    required this.totalPrice,
    this.notes,
    this.userName,
    this.staffName,
    this.packageName,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      userId: json['user_id'],
      staffId: json['staff_id'],
      packageId: json['package_id'],
      orderDate: json['order_date'] ?? '',
      orderTime: json['order_time'] ?? '',
      address: json['address'],
      latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
      longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
      vehiclePlate: json['vehicle_plate'],
      status: json['status'],
      totalPrice: double.parse(json['total_price'].toString()),
      notes: json['notes'],
      userName: json['user_name'],
      staffName: json['staff_name'],
      packageName: json['package_name'],
    );
  }

  String get statusLabel {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'on_the_way':
        return 'Dalam Perjalanan';
      case 'in_progress':
        return 'Sedang Dikerjakan';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  }
}
