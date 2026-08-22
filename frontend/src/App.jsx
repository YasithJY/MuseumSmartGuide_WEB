import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Museums from './pages/Museums';
import Gallery from './pages/Gallery';
import Exhibit from './pages/Exhibit';
import Search from './pages/Search';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ScanPage from './pages/ScanPage';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoutes';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-parchment bg-paper-texture dark:bg-dark-surface dark:bg-none transition-colors duration-300">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/museums" element={<Museums />} />
            <Route path="/gallery/:id" element={<Gallery />} />
            <Route path="/exhibit/:id" element={<Exhibit />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan" element={<ScanPage />} />

            {/* 🔒 Hidden admin login — NOT linked anywhere in the UI */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Visitor Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/quiz" element={<QuizPage />} />
            </Route>

            {/* Protected Curator/Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
