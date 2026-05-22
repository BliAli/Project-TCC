# Cuci Mobil Panggilan - Implementation Plan

## Context
University Cloud Computing final project: an on-demand mobile car wash booking platform. Users order car wash services to their location via mobile app; admin manages staff/orders via web dashboard. Must deploy 3 services on Cloud Run, use both SQL and NoSQL databases, and expose 15+ REST API endpoints.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Cloud Run Services                 │
│                                                      │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │ Frontend │   │ Auth Service │   │ API Service  │  │
│  │ (React)  │   │  (Express)   │   │  (Express)   │  │
│  │ :3000    │   │  :5000       │   │  :5001       │  │
│  └──────────┘   └──────┬───────┘   └──────┬───────┘  │
│                        │                   │          │
│                  ┌─────┴─────┐    ┌────────┴───────┐ │
│                  │  MySQL    │    │   MongoDB      │ │
│                  │ Cloud SQL │    │   (GCE)        │ │
│                  └───────────┘    └────────────────┘ │
│                                         │            │
│                                  ┌──────┴─────┐     │
│                                  │Cloud Storage│     │
│                                  └────────────┘     │
└─────────────────────────────────────────────────────┘
```

**3 Services:**
1. `frontend` - React web admin dashboard (Cloud Run)
2. `auth-service` - Authentication & user management (Cloud Run)
3. `api-service` - Core business logic: orders, staff, packages, schedules, ratings, tracking, chat, photos (Cloud Run)

---

## Project Structure

```
Project Akhir/
├── backend/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js        # MySQL connection
│   │   │   ├── controllers/
│   │   │   │   └── authController.js
│   │   │   ├── middleware/
│   │   │   │   └── authMiddleware.js   # JWT verification
│   │   │   ├── models/
│   │   │   │   └── userModel.js
│   │   │   ├── routes/
│   │   │   │   └── authRoutes.js
│   │   │   └── index.js
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── api-service/
│       ├── src/
│       │   ├── config/
│       │   │   ├── mysql.js            # MySQL connection
│       │   │   ├── mongodb.js          # MongoDB connection
│       │   │   └── storage.js          # Cloud Storage client
│       │   ├── controllers/
│       │   │   ├── staffController.js
│       │   │   ├── packageController.js
│       │   │   ├── orderController.js
│       │   │   ├── scheduleController.js
│       │   │   ├── ratingController.js
│       │   │   ├── trackingController.js
│       │   │   ├── chatController.js
│       │   │   ├── photoController.js
│       │   │   └── notificationController.js
│       │   ├── middleware/
│       │   │   ├── authMiddleware.js    # JWT verification (shared logic)
│       │   │   └── upload.js           # Multer for file uploads
│       │   ├── models/
│       │   │   ├── sql/
│       │   │   │   ├── staffModel.js
│       │   │   │   ├── packageModel.js
│       │   │   │   ├── orderModel.js
│       │   │   │   ├── scheduleModel.js
│       │   │   │   ├── paymentModel.js
│       │   │   │   └── ratingModel.js
│       │   │   └── nosql/
│       │   │       ├── trackingModel.js
│       │   │       ├── chatModel.js
│       │   │       ├── photoModel.js
│       │   │       ├── statusUpdateModel.js
│       │   │       └── notificationModel.js
│       │   ├── routes/
│       │   │   ├── staffRoutes.js
│       │   │   ├── packageRoutes.js
│       │   │   ├── orderRoutes.js
│       │   │   ├── scheduleRoutes.js
│       │   │   ├── ratingRoutes.js
│       │   │   ├── trackingRoutes.js
│       │   │   ├── chatRoutes.js
│       │   │   ├── photoRoutes.js
│       │   │   └── notificationRoutes.js
│       │   └── index.js
│       ├── .env.example
│       ├── package.json
│       └── Dockerfile
│
├── frontend/
│   ├── web-admin/                      # React (Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/              # API call functions
│   │   │   ├── context/               # Auth context
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── Dockerfile
│   │
│   └── mobile-app/                     # Flutter
│       ├── lib/
│       │   ├── models/
│       │   ├── screens/
│       │   ├── services/
│       │   ├── providers/
│       │   ├── widgets/
│       │   └── main.dart
│       └── pubspec.yaml
│
├── database/
│   └── init.sql                        # MySQL schema initialization
│
└── docker-compose.yml                  # Local development
```

---

## Database Schemas

### MySQL Tables (7 tables - Cloud SQL)

```sql
-- 1. users (pelanggan + admin)
CREATE TABLE users (
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
CREATE TABLE staff (
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
CREATE TABLE service_packages (
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
CREATE TABLE orders (
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
CREATE TABLE payments (
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
CREATE TABLE schedules (
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
CREATE TABLE ratings (
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
```

### MongoDB Collections (5 collections - GCE)

```javascript
// 1. staff_tracking - tracking staf realtime
{
    staff_id: Number,
    latitude: Number,
    longitude: Number,
    heading: Number,
    speed: Number,
    is_online: Boolean,
    last_updated: Date
}

// 2. service_photos - foto hasil layanan
{
    order_id: Number,
    staff_id: Number,
    photos: [{
        url: String,           // Cloud Storage URL
        type: String,          // "before" | "after"
        uploaded_at: Date
    }],
    created_at: Date
}

// 3. chats - chat pelanggan-staf
{
    order_id: Number,
    participants: {
        user_id: Number,
        staff_id: Number
    },
    messages: [{
        sender_type: String,   // "user" | "staff"
        sender_id: Number,
        message: String,
        sent_at: Date,
        read: Boolean
    }],
    created_at: Date
}

// 4. order_status_updates - update status order
{
    order_id: Number,
    updates: [{
        status: String,
        message: String,
        updated_by: String,    // "system" | "staff" | "admin"
        updated_at: Date
    }],
    created_at: Date
}

// 5. notifications - notifikasi jadwal
{
    user_id: Number,
    user_type: String,         // "customer" | "staff" | "admin"
    title: String,
    message: String,
    type: String,              // "order" | "schedule" | "promo" | "system"
    is_read: Boolean,
    data: Object,              // flexible metadata
    created_at: Date
}
```

---

## API Endpoints (26 total)

### Auth Service (port 5000) - 4 endpoints
| #  | Method | Endpoint              | Description          |
|----|--------|-----------------------|----------------------|
| 1  | POST   | /api/auth/register    | Register user        |
| 2  | POST   | /api/auth/login       | Login user           |
| 3  | GET    | /api/auth/profile     | Get current profile  |
| 4  | PUT    | /api/auth/profile     | Update profile       |

### API Service (port 5001) - 22 endpoints

**Staff CRUD:**
| #  | Method | Endpoint              | Description          |
|----|--------|-----------------------|----------------------|
| 5  | GET    | /api/staff            | List all staff       |
| 6  | GET    | /api/staff/:id        | Get staff detail     |
| 7  | POST   | /api/staff            | Create staff         |
| 8  | PUT    | /api/staff/:id        | Update staff         |
| 9  | DELETE | /api/staff/:id        | Delete staff         |

**Service Packages CRUD:**
| #  | Method | Endpoint              | Description          |
|----|--------|-----------------------|----------------------|
| 10 | GET    | /api/packages         | List packages        |
| 11 | POST   | /api/packages         | Create package       |
| 12 | PUT    | /api/packages/:id     | Update package       |
| 13 | DELETE | /api/packages/:id     | Delete package       |

**Orders CRUD:**
| #  | Method | Endpoint              | Description          |
|----|--------|-----------------------|----------------------|
| 14 | GET    | /api/orders           | List orders          |
| 15 | GET    | /api/orders/:id       | Get order detail     |
| 16 | POST   | /api/orders           | Create order         |
| 17 | PUT    | /api/orders/:id       | Update order         |
| 18 | DELETE | /api/orders/:id       | Cancel order         |

**Ratings:**
| #  | Method | Endpoint                  | Description          |
|----|--------|---------------------------|----------------------|
| 19 | POST   | /api/ratings              | Submit rating        |
| 20 | GET    | /api/ratings/staff/:id    | Get staff ratings    |

**Schedules:**
| #  | Method | Endpoint              | Description          |
|----|--------|-----------------------|----------------------|
| 21 | GET    | /api/schedules        | List schedules       |
| 22 | POST   | /api/schedules        | Create schedule      |

**NoSQL Endpoints:**
| #  | Method | Endpoint                      | Description              |
|----|--------|-------------------------------|--------------------------|
| 23 | PUT    | /api/tracking/:staffId        | Update staff location    |
| 24 | GET    | /api/tracking/:staffId        | Get staff location       |
| 25 | POST   | /api/chat/:orderId            | Send chat message        |
| 26 | GET    | /api/chat/:orderId            | Get chat messages        |

---

## Authentication Strategy
- **JWT** (jsonwebtoken) with access tokens
- Auth service issues tokens on login/register
- API service verifies tokens via shared JWT secret
- Middleware extracts user from token and attaches to `req.user`
- Role-based access: `admin` for web dashboard, `customer` for mobile app

## Cloud Storage Integration
- Used for service photos (before/after car wash)
- `multer` handles multipart file uploads in API service
- Files uploaded to GCS bucket, URL stored in MongoDB `service_photos` collection
- Photos served via public GCS URL

---

## Build Order (Backend First)

### Phase 1: Backend Foundation
1. Initialize `auth-service` with Express, MySQL connection, JWT
2. Build auth endpoints (register, login, profile)
3. Initialize `api-service` with Express, MySQL + MongoDB connections
4. Build SQL CRUD endpoints (staff, packages, orders, payments, schedules, ratings)
5. Build NoSQL endpoints (tracking, chat, photos, notifications)
6. Add Cloud Storage integration for photo uploads
7. Add Docker configs for both services
8. Test all 26 endpoints with Postman/Thunder Client

### Phase 2: Web Admin Frontend
9. Scaffold React app with Vite
10. Build auth pages (login)
11. Build dashboard with stats
12. Build staff management (CRUD + scheduling)
13. Build order management (list, detail, status update)
14. Build package management (CRUD)
15. Add Dockerfile for frontend

### Phase 3: Mobile App (Flutter)
16. Scaffold Flutter project
17. Build auth screens (register, login)
18. Build home screen (package selection)
19. Build order flow (select package → set address → confirm)
20. Build order tracking (status + staff location)
21. Build rating screen
22. Build chat screen

### Phase 4: Deployment
23. Deploy MySQL on Cloud SQL
24. Deploy MongoDB on GCE
25. Create Cloud Storage bucket
26. Deploy 3 services on Cloud Run
27. Configure environment variables

---

## Environment Variables

### auth-service
```
PORT=5000
DB_HOST=<cloud-sql-ip>
DB_USER=root
DB_PASSWORD=<password>
DB_NAME=cuci_mobil
JWT_SECRET=<secret-key>
```

### api-service
```
PORT=5001
DB_HOST=<cloud-sql-ip>
DB_USER=root
DB_PASSWORD=<password>
DB_NAME=cuci_mobil
MONGODB_URI=mongodb://<gce-ip>:27017/cuci_mobil
JWT_SECRET=<secret-key>
GCS_BUCKET_NAME=cuci-mobil-photos
GCS_PROJECT_ID=<gcp-project-id>
```

### frontend (web-admin)
```
VITE_AUTH_API_URL=https://auth-service-xxx.run.app
VITE_API_URL=https://api-service-xxx.run.app
```

---

## Verification
1. **Backend**: Test all 26 endpoints via Postman/Thunder Client after each phase
2. **Frontend**: Run `npm run dev`, test CRUD operations through the UI
3. **Mobile**: Run with Flutter (`flutter run`), test order flow end-to-end
4. **Docker**: Build and run all 3 services with `docker-compose up`
5. **Deployment**: Verify all Cloud Run services respond, databases are accessible
