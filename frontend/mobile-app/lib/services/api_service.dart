import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String authBaseUrl = 'http://localhost:5000';
  static const String apiBaseUrl = 'http://localhost:5001';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _authHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ==================== AUTH ====================

  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? address,
  }) async {
    final res = await http.post(
      Uri.parse('$authBaseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'address': address,
        'role': 'customer',
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final res = await http.post(
      Uri.parse('$authBaseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final res = await http.get(
      Uri.parse('$authBaseUrl/api/auth/profile'),
      headers: await _authHeaders(),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> updateProfile({
    required String name,
    String? phone,
    String? address,
  }) async {
    final res = await http.put(
      Uri.parse('$authBaseUrl/api/auth/profile'),
      headers: await _authHeaders(),
      body: jsonEncode({'name': name, 'phone': phone, 'address': address}),
    );
    return jsonDecode(res.body);
  }

  // ==================== PACKAGES ====================

  static Future<List<dynamic>> getPackages() async {
    final res = await http.get(
      Uri.parse('$apiBaseUrl/api/packages'),
      headers: {'Content-Type': 'application/json'},
    );
    final data = jsonDecode(res.body);
    return data['packages'] ?? [];
  }

  // ==================== ORDERS ====================

  static Future<List<dynamic>> getOrders() async {
    final res = await http.get(
      Uri.parse('$apiBaseUrl/api/orders'),
      headers: await _authHeaders(),
    );
    final data = jsonDecode(res.body);
    return data['orders'] ?? [];
  }

  static Future<Map<String, dynamic>> getOrderDetail(int id) async {
    final res = await http.get(
      Uri.parse('$apiBaseUrl/api/orders/$id'),
      headers: await _authHeaders(),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> createOrder({
    required int packageId,
    required String orderDate,
    required String orderTime,
    required String address,
    double? latitude,
    double? longitude,
    String? vehiclePlate,
    required double totalPrice,
    String? notes,
    String? paymentMethod,
  }) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/api/orders'),
      headers: await _authHeaders(),
      body: jsonEncode({
        'package_id': packageId,
        'order_date': orderDate,
        'order_time': orderTime,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'vehicle_plate': vehiclePlate,
        'total_price': totalPrice,
        'notes': notes,
        'payment_method': paymentMethod,
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> cancelOrder(int id) async {
    final res = await http.delete(
      Uri.parse('$apiBaseUrl/api/orders/$id'),
      headers: await _authHeaders(),
    );
    return jsonDecode(res.body);
  }

  // ==================== RATINGS ====================

  static Future<Map<String, dynamic>> submitRating({
    required int orderId,
    required int staffId,
    required int score,
    String? comment,
  }) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/api/ratings'),
      headers: await _authHeaders(),
      body: jsonEncode({
        'order_id': orderId,
        'staff_id': staffId,
        'score': score,
        'comment': comment,
      }),
    );
    return jsonDecode(res.body);
  }

  // ==================== TRACKING ====================

  static Future<Map<String, dynamic>> getStaffTracking(int staffId) async {
    final res = await http.get(
      Uri.parse('$apiBaseUrl/api/tracking/$staffId'),
      headers: await _authHeaders(),
    );
    return jsonDecode(res.body);
  }

  // ==================== CHAT ====================

  static Future<Map<String, dynamic>> getChatMessages(int orderId) async {
    final res = await http.get(
      Uri.parse('$apiBaseUrl/api/chat/$orderId'),
      headers: await _authHeaders(),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> sendChatMessage({
    required int orderId,
    required String senderType,
    required int senderId,
    required String message,
    int? staffId,
    int? userId,
  }) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/api/chat/$orderId'),
      headers: await _authHeaders(),
      body: jsonEncode({
        'sender_type': senderType,
        'sender_id': senderId,
        'message': message,
        'staff_id': staffId,
        'user_id': userId,
      }),
    );
    return jsonDecode(res.body);
  }
}
