# 🌍 Tripatee - Premium & Luxury Travel Booking Platform

Welcome to **Tripatee**, a complete, production-ready travel booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It offers sleek luxury travel branding, responsive search filters, multi-step checkout booking simulation, and full administration panels for managing tours.

![Tripatee](https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&auto=format&fit=crop)

### 🔗 Live Preview: [https://love-melt.vercel.app/](https://love-melt.vercel.app/)

---

## 🌟 Key Features
- **Luxury Aesthetic**: Breathtaking UI with rich glassmorphism and modern visual treatments.
- **Dynamic Search Engine**: Real-time filtering by budget, dates, guests, and destinations.
- **Booking Flow**: Multi-step checkout with simulated payments.
- **Admin Dashboard**: Full CMS to manage packages, users, and track KPIs.
- **Secure Authentication**: JWT-based auth with OTP email verification.

---

## 📂 Project Structure

```text
tripatee/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Customer views & Admin panel
│   │   ├── services/       # Network clients (api.js)
│   │   └── App.jsx         # App routes config
│   └── vite.config.js      
│
└── server/                 # Express Backend API
    ├── controllers/        # Route controllers
    ├── middlewares/        # Security headers, auth guards
    ├── models/             # Mongoose schemas
    ├── routes/             # API router definitions
    ├── utils/              # Nodemailer, Cloudinary, scripts
    └── index.js            # Express server entry
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** instance

### 2. Backend Setup
1. Open a terminal in the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Configure your `.env` file based on `.env.example`.
3. Run the seed script to populate the collections:
   ```bash
   npm run seed
   ```
4. Start the Express backend server:
   ```bash
   npm start
   ```

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
