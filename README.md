# Meeting Room Booking System Frontend

An Angular + TypeScript frontend for the Meeting Room Booking System.

This application communicates with the backend REST API and provides role-based functionality for Admin, Owner, and User.

---

## 🌐 Live Deployment Access

**Application URL:** `https://meeting-room-booking-six-pi.vercel.app`

**Backend API:** `https://meeting-room-booking-api-production.up.railway.app`

---

## 🚀 Features

- Angular
- TypeScript
- Role-based interface
- Meeting room booking management
- Booking creation
- Booking listing
- Booking deletion based on user permissions
- User management (Admin only)
- Booking summary (Admin)
- View Booking by User Grouped (Admin)
- Responsive UI
- REST API integration
- Form validation and error handling

---

## 📦 Tech Stack

- Angular
- TypeScript
- Angular Router
- Angular HttpClient
- RxJS
- Tailwind CSS

---

## 📁 Project Structure

```bash
src/
│
├── app/
│   ├── care/
│   ├── layout/
│   ├── shared/
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.css
│   ├── app.html
│   ├── app.routes.server.ts
│   └── app.routes.ts
│   └── app.spec.ts
│   └── app.ts
│
├── env/
└── index.html
└── main.server.ts
└── main.ts
└── server.ts
└── styles.css
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/HtetO2Ko/Meeting-Room-Booking.git
```

Move into the project folder:

```bash
cd Meeting-Room-Booking
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run Development Server

```bash
npm start
```

Application will run on:

```text
http://localhost:4200
```

---

## 👤 Role Selection

For this assessment, a traditional login screen is **not implemented**.

Instead, the application provides **three predefined users** that allow the evaluator to easily switch between roles and test different permission levels.

Available roles:

- Admin
- Owner
- User

Simply select one of the predefined users from the home page to access the application with the corresponding permissions.

This approach satisfies the assessment requirement of clearly distinguishing user roles while keeping authentication simple.

---

## 🔗 Backend Repository

https://github.com/HtetO2Ko/Meeting-Room-Booking-API.git

---

## 📮 API Documentation

Please import the provided Postman Collection (`.json`) into Postman.

Backend API Base URL:

```text
https://meeting-room-booking-api-production.up.railway.app
```
