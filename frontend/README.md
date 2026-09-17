# Museum 150 Smart Guide - Frontend

This is the frontend application for the Museum 150 Smart Guide, built with React and Vite. It serves as a Progressive Web App (PWA) to guide visitors through the museum with interactive maps, QR code scanning, and more.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **Maps**: Leaflet & React Leaflet
- **QR Code**: HTML5-QRCode
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
Make sure you have Node.js installed.

### Installation

Navigate to the `frontend` directory and install dependencies (or run from the root directory using the root wrapper):

```bash
cd frontend
npm install --legacy-peer-deps
```

### Running the Development Server

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Build for Production

To create a production-ready build:

```bash
npm run build
```

This will generate optimized static files in the `dist` directory.

## Features

- Interactive indoor museum map using Leaflet
- QR code scanning for artifacts and exhibits
- Beautiful and responsive UI using Tailwind CSS
- Smooth animations with Framer Motion
