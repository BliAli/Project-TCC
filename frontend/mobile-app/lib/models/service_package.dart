class ServicePackage {
  final int id;
  final String name;
  final String? description;
  final String vehicleType;
  final double price;
  final int durationMinutes;

  ServicePackage({
    required this.id,
    required this.name,
    this.description,
    required this.vehicleType,
    required this.price,
    required this.durationMinutes,
  });

  factory ServicePackage.fromJson(Map<String, dynamic> json) {
    return ServicePackage(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      vehicleType: json['vehicle_type'],
      price: double.parse(json['price'].toString()),
      durationMinutes: json['duration_minutes'],
    );
  }

  String get vehicleTypeLabel {
    switch (vehicleType) {
      case 'motor':
        return 'Motor';
      case 'mobil_kecil':
        return 'Mobil Kecil';
      case 'mobil_besar':
        return 'Mobil Besar';
      case 'suv':
        return 'SUV';
      default:
        return vehicleType;
    }
  }
}
