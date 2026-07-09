# Flashmob Travels - Premium & Luxury Travel Booking Platform (MERN Stack)

Flashmob Travels is a complete, production-ready travel booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It offers a sleek luxury travel branding, responsive search filters, multi-step checkout booking simulation, and full administration panels for managing tours.

---

## 📂 Project Structure

```text
flashmob-travels/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/         # Static images & stylesheets
│   │   ├── components/     # Reusable components (Navbar, Footer, route guards, loaders)
│   │   ├── context/        # React session contexts (AuthContext.jsx)
│   │   ├── pages/          # Customer views & Admin panel views
│   │   ├── services/       # Network clients (api.js with JWT interceptors)
│   │   ├── App.jsx         # App routes config
│   │   └── main.jsx        # Client entry point
│   ├── index.html          # Web template loaded with Google Fonts
│   └── vite.config.js      # Vite compilation configurations with proxy set
│
└── server/                 # Express Backend API
    ├── config/             # Database connection setups
    ├── controllers/        # Route controllers (Auth, Bookings, Packages, Payments)
    ├── middlewares/        # Security headers, authentication guards, and file parsers
    ├── models/             # Mongoose database schemas
    ├── routes/             # Express API router definitions
    ├── utils/              # Nodemailer helpers, Cloudinary APIs, and seed scripts
    ├── uploads/            # Temporary local media storage directory
    ├── .env                # Port, URI, and API key values
    └── index.js            # Express server startup entry point
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** local instance running on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
1. Open a terminal in the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Make sure your local MongoDB instance is active. Run the seed script to populate the collections:
   ```bash
   npm run seed
   ```
3. Start the Express backend server:
   ```bash
   npm start
   ```
   *The API will listen at `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal in the `client/` directory:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client app will open at `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

Use the following pre-seeded credentials to test user journeys immediately:

### 👤 Customer Account
- **Email:** `user@flashmobtravels.com`
- **Password:** `password123`
- **Verification:** Already verified

### 🔑 Administrator Account (Full Control)
- **Email:** `admin@flashmobtravels.com`
- **Password:** `password123`
- **Verification:** Already verified

---

## 🔗 REST API Endpoints Reference

### 🔐 Authentication Module (`/api/auth`)
- `POST /signup` - Register a new customer
- `POST /verify-otp` - Verify email using the 6-digit OTP code
- `POST /resend-otp` - Dispatch a new OTP verification code
- `POST /login` - Standard password credentials authentication
- `POST /forgot-password` - Request a password recovery OTP code
- `POST /reset-password` - Complete password reset using OTP code

### 🎒 Travel Packages (`/api/packages`)
- `GET /` - List all travel packages (supports search query, budget ranges, and sort configurations)
- `GET /:id` - Retrieve detailed information for a single package with reviews
- `POST /` - Create a new tour package *(Admin only, supports image uploads)*
- `PUT /:id` - Update package parameters *(Admin only)*
- `DELETE /:id` - Remove a tour package *(Admin only)*
- `GET /destinations` - List all travel destinations
- `POST /destinations` - Create a destination *(Admin only)*

### 📝 Booking Engine (`/api/bookings`)
- `POST /` - Register a new booking order *(Private, pending payment)*
- `GET /my-bookings` - Retrieve current user's booking history *(Private)*
- `DELETE /:id` - Cancel a booking *(Private)*
- `GET /` - List all bookings *(Admin only)*
- `PUT /:id` - Update booking status or payment status *(Admin only)*

### 💳 Simulated Payments (`/api/payments`)
- `POST /charge` - Process simulated billing, confirming order and payment state *(Private)*
- `GET /my-payments` - Retrieve payment histories *(Private)*

### 📊 Admin Analytics (`/api/admin`)
- `GET /dashboard` - Aggregate KPI metrics (total bookings, revenue, users) and booking logs *(Admin only)*
