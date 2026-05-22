import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _loading = true;

  User? get user => _user;
  bool get loading => _loading;
  bool get isLoggedIn => _user != null;

  Future<void> checkAuth() async {
    final token = await ApiService.getToken();
    if (token != null) {
      try {
        final data = await ApiService.getProfile();
        _user = User.fromJson(data['user']);
      } catch (_) {
        await logout();
      }
    }
    _loading = false;
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    try {
      final data = await ApiService.login(email: email, password: password);
      if (data['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        _user = User.fromJson(data['user']);
        notifyListeners();
        return null;
      }
      return data['message'] ?? 'Login gagal';
    } catch (e) {
      return 'Koneksi gagal. Periksa jaringan Anda.';
    }
  }

  Future<String?> register(String name, String email, String password, String? phone) async {
    try {
      final data = await ApiService.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
      );
      if (data['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        _user = User.fromJson(data['user']);
        notifyListeners();
        return null;
      }
      return data['message'] ?? 'Registrasi gagal';
    } catch (e) {
      return 'Koneksi gagal. Periksa jaringan Anda.';
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _user = null;
    notifyListeners();
  }
}
