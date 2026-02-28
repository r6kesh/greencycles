# GreenCycle - Scrap Pickup Platform

GreenCycle is a comprehensive, production-ready scrap pickup platform tailored for Nizampet and Miyapur (Hyderabad), similar to ScrapUncle. The platform consists of four main components:

1.  **Backend API (Node.js + Express + MongoDB)**
    *   RESTful API handling authentication, users, orders, agent assignments, and pricing.
    *   Role-based access control (Customer, Admin, Agent).
    *   Integration ready for Twilio/MSG91 (OTP) and Razorpay (Payments).

2.  **Customer Web App (React + Vite + TailwindCSS)**
    *   Premium Dark+Green Eco theme.
    *   OTP Login, dynamic scrap pricing display, and location-restricted booking flow (Nizampet, Miyapur).
    *   Order tracking and AI Chatbot widget.

3.  **Admin Panel (React + Vite + TailwindCSS)**
    *   Comprehensive dashboard with metrics.
    *   Manage and assign orders to agents.
    *   Manage users and live scrap pricing.

4.  **Agent Mobile App (React Native + Expo)**
    *   Agent-specific login flow.
    *   View assigned pickups and earnings summary.
    *   Google Maps deep linking for navigation.
    *   Pickup completion flow: Enter actual weights to compute final payable amounts.

---

## 🚀 Getting Started Locally

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Instance (Local or Atlas URI)
*   Expo CLI (for Agent App)

### 1. Start the Backend
```bash
cd backend
npm install
# Ensure your .env has MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, TWILIO_ACCOUNT_SID, etc.
node src/scripts/seed.js # To seed initial prices and an admin user (if applicable)
npm start # or npm run dev
```

### 2. Start the Customer Web App
```bash
cd customer-web
npm install
# Ensure .env has VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 3. Start the Admin Panel
```bash
cd admin-web
npm install
# Ensure .env has VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Start the Agent Mobile App
```bash
cd agent-app
npm install
npm start
# Press 'a' to open on Android Emulator, 'i' on iOS Simulator, or scan QR code via Expo Go
```

---

## 🏗 Deployment Strategy

*   **Backend:** Deploy via Railway/Render by pushing the repository and specifying `backend` as the root directory. Set environment variables in the dashboard.
*   **Customer & Admin Web:** Deploy to Netlify. Use `npm run build` as the build command and `dist` as the publish directory. Ensure `_redirects` file is used for React Router fallback (`/* /index.html 200`).
*   **Agent App:** Build an APK/AAB via Expo Application Services (EAS): `eas build -p android --profile preview`.

---

## 🔒 Default Test Accounts (If seeded)
*   **Admin:** `admin@greencycle.com` (If using password) or designated phone number + OTP (test OTP is often `1234`).
*   **Agent:** Add via Admin panel or directly inject to MongoDB.

## 📌 Important Notes
*   OTP flows and Payment gateways currently have endpoints set up but may require replacing mock logic with actual SDK calls in `authController.js` and `orderController.js` for full production launch.
*   Image upload logic in the mobile app currently passes a dummy Cloudinary URL. Integrate with `react-native-image-picker` and an upload endpoint for production proofs.
