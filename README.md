# Museum 150 Smart Guide

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An interactive web and Progressive Web App (PWA) smart guide platform designed for modern museum visitor experiences and museum exhibit management. Visitors can explore galleries, scan QR codes on physical exhibits, view 3D artifact models, participate in quizzes, and track their visit history, while museum curators can manage exhibits and view visitor analytics.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
  - [Database Seeding](#database-seeding)
- [API Overview](#api-overview)
- [Scripts Reference](#scripts-reference)

---

## Features

### Visitor Experience
- **Interactive Indoor Maps**: Navigate galleries and pinpoint exhibits using Leaflet indoor mapping.
- **QR Code Scanner**: Instantly access artifact details and curated audio/visual media by scanning QR codes.
- **3D Artifact Viewer**: Inspect 3D models of historical artifacts directly in the browser via Google `<model-viewer>`.
- **Interactive Quizzes**: Test knowledge of exhibits with scoring and interactive feedback.
- **Personalized Profile**: Save favourite exhibits, view visit histories, and track achievements.

### Administrative Portal
- **Content Management**: Manage museums, galleries, exhibit records, categories, and media assets.
- **Automated QR Generation**: Generate printable QR codes mapped to exhibit detail URLs.
- **Analytics Dashboard**: Real-time visitor interaction metrics and engagement visualization using Recharts.
- **Role-Based Access Control**: Secure JWT-based authentication for visitors and administrators.

---

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Navigation**: React Router DOM (v6)
- **Map Engine**: Leaflet & React Leaflet
- **QR Scanner**: HTML5-QRCode
- **3D Rendering**: `@google/model-viewer`
- **Charts & Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend (`/backend`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & ODM**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads & Storage**: Multer & AWS S3 / Cloudflare R2 SDK
- **Security**: Helmet & CORS
- **Utilities**: `qrcode` library for dynamic QR creation

---

## Project Architecture

```plaintext
MuseumSmartGuide_WEB/
├── package.json               # Root wrapper with concurrent development scripts
├── backend/                   # Express.js REST API
│   ├── config/                # Database and cloud storage configuration
│   ├── controllers/           # API request controllers
│   ├── middleware/            # Auth, security, and error handlers
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Express API route endpoints
│   ├── uploads/               # Static/local media uploads
│   ├── utils/                 # QR utilities and data seeders
│   ├── server.js              # Server entry point
│   └── package.json
└── frontend/                  # React + Vite Client
    ├── public/                # Static assets, models, and manifests
    ├── src/
    │   ├── assets/            # App images and vector icons
    │   ├── components/        # Reusable UI components
    │   ├── context/           # React context providers (Auth, etc.)
    │   ├── pages/             # Route page views (Home, Exhibit, Dashboard, etc.)
    │   ├── routes/            # Application routing configuration
    │   ├── utils/             # Helper functions and API clients
    │   ├── App.jsx            # Main app container
    │   └── main.jsx           # Client entry point
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later)
- **MongoDB** (local daemon running on `localhost:27017` or a MongoDB Atlas connection URI)

### Installation

Clone the repository and install all dependencies for both the root, backend, and frontend with a single command:

```bash
git clone https://github.com/YasithJY/MuseumSmartGuide_WEB.git
cd MuseumSmartGuide_WEB
npm run install:all
```

Alternatively, you can install dependencies individually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install --legacy-peer-deps
```

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/museum150
JWT_SECRET=your_jwt_secret_key_here

# Optional: Cloudflare R2 / AWS S3 Storage Credentials
# R2_ACCOUNT_ID=your_account_id
# R2_ACCESS_KEY_ID=your_access_key_id
# R2_SECRET_ACCESS_KEY=your_secret_access_key
# R2_BUCKET_NAME=your_bucket_name
# R2_PUBLIC_URL=https://your-custom-domain.com
```

### Running the Application

To run both the backend server and frontend client concurrently from the project root:

```bash
npm run dev
```

- **Frontend Client**: Accessible at `http://localhost:5173`
- **Backend API**: Accessible at `http://localhost:5000`

#### Running Individually

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Database Seeding

To populate the database with initial sample exhibits, galleries, categories, and users:

```bash
cd backend
npm run seed
```

---

## API Overview

The backend REST API exposes the following primary endpoints under `/api`:

| Resource | Route | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | User registration, login, profile, and token verification |
| **Museums** | `/api/museums` | Museum profiles, information, and operating hours |
| **Galleries** | `/api/galleries` | Gallery spaces and indoor floor plans |
| **Exhibits** | `/api/exhibits` | Artifact details, 3D assets, descriptions, and QR endpoints |
| **Categories** | `/api/categories` | Exhibit category classifications |
| **Quizzes** | `/api/quizzes` | Interactive quiz questions and score evaluations |
| **Media** | `/api/media` | Image, audio, and 3D asset uploads |
| **Analytics** | `/api/analytics` | Visit statistics, popularity metrics, and admin reports |

---

## Scripts Reference

From the root repository directory:

- `npm run install:all` - Installs dependencies across both `backend` and `frontend`.
- `npm run dev` - Starts backend (Nodemon) and frontend (Vite) concurrently.
