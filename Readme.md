# 🚌 Track My Bus - College Bus Tracking System

> **A comprehensive real-time bus tracking application for college transportation management, enabling students to track buses live on Google Maps.**

---

## 🌐 Live Demo

<div align="center">

### 🔗 **[bus.codeflayers.tech](https://bus.codeflayers.tech)**

[![Live Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)](https://bus.codeflayers.tech)
[![Website](https://img.shields.io/badge/Website-bus.codeflayers.tech-blue?style=for-the-badge&logo=google-chrome)](https://bus.codeflayers.tech)

</div>

---

## 📋 System Overview

A full-stack bus tracking application built with **React + Vite** frontend and **Node.js + Express** backend, featuring:
- **Real-time GPS tracking** with Google Maps integration
- **WebSocket communication** via Socket.io for live updates
- **OTP-based authentication** using Twilio
- **Android support** via Capacitor
- **Four user roles**: Admin, Coordinator, Driver, and Student

---

## 🎯 User Roles & Permissions

### 1. 👨‍💼 Admin
- Complete control over the entire system
- View analytics and dashboards for all buses and routes
- Manage students, coordinators, and drivers
- Monitor all bus activities in real-time

### 2. 🧑‍✈️ Coordinator
- Add and remove drivers
- Set and modify bus routes
- Manage route assignments to buses

### 3. 🚗 Driver
- Turn GPS tracking on/off
- View assigned route with waypoints
- Real-time location sharing with the system

### 4. 🎓 Student
- Track buses in real-time on Google Maps
- View route details and scheduled stops
- See estimated time of arrival (ETA)
- Call driver directly from the app

---

## 🏗️ Project Structure

```
Track_My_Bus/
├── 📁 BackEnd/                      # Node.js + Express API Server
│   ├── src/
│   │   ├── controllers/             # Request handlers (8 files)
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── broadcast.controller.js
│   │   │   ├── bus.controller.js
│   │   │   ├── coordinator.controller.js
│   │   │   ├── driver.controller.js
│   │   │   ├── route.controller.js
│   │   │   └── student.controller.js
│   │   ├── middleware/              # Auth & error handling (2 files)
│   │   │   ├── auth.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── models/                  # MongoDB schemas (6 files)
│   │   │   ├── Analytics.model.js
│   │   │   ├── Broadcast.model.js
│   │   │   ├── Bus.model.js
│   │   │   ├── OTP.model.js
│   │   │   ├── Route.model.js
│   │   │   └── User.model.js
│   │   ├── routes/                  # API endpoints (8 files)
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── broadcast.routes.js
│   │   │   ├── bus.routes.js
│   │   │   ├── coordinator.routes.js
│   │   │   ├── driver.routes.js
│   │   │   ├── route.routes.js
│   │   │   └── student.routes.js
│   │   ├── scripts/
│   │   │   └── seed.js              # Database seeding
│   │   ├── utils/                   # Utility functions (3 files)
│   │   │   ├── jwt.js
│   │   │   ├── otp.utils.js
│   │   │   └── validation.js
│   │   └── server.js                # Main server entry point
│   └── package.json
│
├── 📁 FrontEnd/                     # React + Vite Application
│   ├── src/
│   │   ├── components/              # React components (16 files)
│   │   │   ├── admin/               # Admin dashboard (7 files)
│   │   │   │   ├── AdminAnalytics.jsx
│   │   │   │   ├── BroadcastNotification.jsx
│   │   │   │   ├── BusManagement.jsx
│   │   │   │   ├── CoordinatorManagement.jsx
│   │   │   │   ├── DriverManagement.jsx
│   │   │   │   ├── RouteManagement.jsx
│   │   │   │   └── StudentManagement.jsx
│   │   │   ├── common/              # Shared components (1 file)
│   │   │   │   └── GoogleMapView.jsx
│   │   │   ├── coordinator/         # Coordinator components (3 files)
│   │   │   │   ├── BusManagement.jsx
│   │   │   │   ├── DriverManagement.jsx
│   │   │   │   └── RouteManagement.jsx
│   │   │   └── student/             # Student tracking (5 files)
│   │   │       ├── BusDetails.jsx
│   │   │       ├── BusTracker.jsx
│   │   │       ├── BusTrackingView.jsx
│   │   │       ├── StudentHome.jsx
│   │   │       └── TripDetailsCard.jsx
│   │   ├── pages/                   # Main page components (7 files)
│   │   │   ├── AdminPage.jsx
│   │   │   ├── CoordinatorPage.jsx
│   │   │   ├── DriverPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   └── StudentPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Authentication hook
│   │   ├── utils/
│   │   │   ├── api.js               # API client
│   │   │   └── locationService.js   # Location utilities
│   │   └── styles/                  # CSS stylesheets
│   ├── android/                     # Capacitor Android project
│   ├── public/                      # Static assets
│   └── package.json
│
├── 📄 LICENSE                       # MIT License
└── 📄 Readme.md
```

---

## 🔧 Tech Stack

### Frontend
| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| **React 19**         | UI Framework            |
| **Vite 7**           | Build Tool & Dev Server |
| **React Router DOM** | Client-side routing     |
| **Google Maps API**  | Map integration         |
| **Socket.io Client** | Real-time communication |
| **Tailwind CSS**     | Styling                 |
| **Axios**            | HTTP requests           |
| **Capacitor**        | Native Android support  |

### Backend
| Technology             | Purpose               |
| ---------------------- | --------------------- |
| **Node.js**            | Runtime environment   |
| **Express 5**          | Web framework         |
| **MongoDB + Mongoose** | Database              |
| **Socket.io**          | WebSocket server      |
| **JWT**                | Authentication tokens |
| **Twilio**             | OTP SMS services      |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Track_My_Bus
   ```

2. **Setup Backend**
   ```bash
   cd BackEnd
   npm install
   ```
   
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/track-my-bus
   JWT_SECRET=your_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

3. **Setup Frontend**
   ```bash
   cd ../FrontEnd
   npm install
   ```
   
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### Running the Application

**Start Backend (Development):**
```bash
cd BackEnd
npm run dev
```

**Start Frontend (Development):**
```bash
cd FrontEnd
npm run dev
```

---

## 📱 Android App

The app supports native Android deployment via Capacitor.

```bash
cd FrontEnd
npm run build
npx cap sync android
npx cap open android
```

See `FrontEnd/ANDROID_SETUP.md` for detailed instructions.

---

## 🔌 Real-Time Communication

### WebSocket Events

| Event             | Direction       | Description            |
| ----------------- | --------------- | ---------------------- |
| `location-update` | Server → Client | Bus location updates   |
| `driver-location` | Driver → Server | Driver GPS coordinates |

### GPS Tracking Flow
1. Driver enables GPS tracking
2. Location updates sent every 10 seconds
3. Server broadcasts to subscribed students
4. Map updates in real-time

---

## 🗺️ Real-Time Tracking Logic

### Stop Status Display

| Scenario                       | Display                      |
| ------------------------------ | ---------------------------- |
| Bus is **OFFLINE**             | Scheduled time from database |
| Bus is **LIVE**, stop upcoming | ETA in minutes               |
| Bus at current stop            | "Now"                        |
| Bus passed stop                | "Passed"                     |

### Color Indicators
- ✅ **Green**: Reached stops
- ⚪ **Gray**: Upcoming stops
- 🔵 **Blue**: Current bus location
- 📍 **Red**: Student location

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login

### Buses
- `GET /api/buses` - List all buses
- `GET /api/buses/:id` - Get bus details

### Routes
- `GET /api/routes` - List all routes
- `GET /api/routes/:id` - Get route with waypoints

---

## 🚀 Key Features

| Feature                   | Description                                 |
| ------------------------- | ------------------------------------------- |
| ✅ Dynamic Bus Tracking    | Real-time GPS position updates              |
| ✅ Stop Status Logic       | Shows "Reached" for confirmed arrivals      |
| ✅ ETA Calculation         | Calculates remaining time based on distance |
| ✅ Bus Switching           | Seamlessly switch between tracking buses    |
| ✅ Live/Offline Indication | Shows connection status                     |
| ✅ Driver Contact          | Direct calling from the app                 |
| ✅ Android Native App      | Capacitor-based mobile app                  |

---

## 🔐 Security Features

- **JWT-based authentication**
- **OTP verification** for secure login
- **Role-based access control**
- **CORS protection**

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=<mongodb_connection_string>
JWT_SECRET=<your_secret_key>
TWILIO_ACCOUNT_SID=<twilio_sid>
TWILIO_AUTH_TOKEN=<twilio_token>
TWILIO_PHONE_NUMBER=<twilio_phone>
```

### Frontend (.env)
```env
VITE_API_URL=<backend_url>
VITE_GOOGLE_MAPS_API_KEY=<google_maps_api_key>
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

### 🌐 **Live at: [bus.codeflayers.tech](https://bus.codeflayers.tech)**

Made with ❤️ for better college transportation

</div>
