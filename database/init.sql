CREATE DATABASE IF NOT EXISTS cuci_mobil;
USE cuci_mobil;

-- 1. users (pelanggan + admin)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. staff (petugas cuci)
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    photo_url VARCHAR(255),
    status ENUM('available', 'busy', 'off') DEFAULT 'available',
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. service_packages (paket layanan)
CREATE TABLE IF NOT EXISTS service_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    vehicle_type ENUM('motor', 'mobil_kecil', 'mobil_besar', 'suv') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. orders (pesanan)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    staff_id INT,
    package_id INT NOT NULL,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    vehicle_plate VARCHAR(20),
    status ENUM('pending', 'confirmed', 'on_the_way', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (package_id) REFERENCES service_packages(id)
);

-- 5. payments (pembayaran)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('cash', 'transfer', 'ewallet') NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 6. schedules (jadwal staf)
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 7. ratings (rating staf)
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    staff_id INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Seed data: admin user (password: admin123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin', 'admin@cucimobil.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'admin');

-- Seed data: sample service packages
INSERT INTO service_packages (name, description, vehicle_type, price, duration_minutes) VALUES
('Cuci Standar Motor', 'Cuci exterior motor dengan sabun khusus', 'motor', 25000, 30),
('Cuci Premium Motor', 'Cuci exterior + interior motor, semir ban', 'motor', 45000, 45),
('Cuci Standar Mobil Kecil', 'Cuci exterior mobil kecil (Agya, Brio, dll)', 'mobil_kecil', 50000, 45),
('Cuci Premium Mobil Kecil', 'Cuci exterior + interior + vacuum mobil kecil', 'mobil_kecil', 85000, 60),
('Cuci Standar Mobil Besar', 'Cuci exterior mobil sedan/MPV', 'mobil_besar', 65000, 50),
('Cuci Premium Mobil Besar', 'Cuci exterior + interior + vacuum sedan/MPV', 'mobil_besar', 100000, 75),
('Cuci Standar SUV', 'Cuci exterior SUV/Pickup', 'suv', 80000, 60),
('Cuci Premium SUV', 'Cuci exterior + interior + vacuum SUV/Pickup', 'suv', 130000, 90);

-- Seed data: sample staff
INSERT INTO staff (name, email, phone) VALUES
('Budi Santoso', 'budi@cucimobil.com', '081111111111'),
('Andi Pratama', 'andi@cucimobil.com', '081222222222'),
('Rudi Hermawan', 'rudi@cucimobil.com', '081333333333');
