import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Exam from './pages/Exam'
import Footer from "./components/Footer";
import ThankYou from './pages/ThankYou';
import Certificate from './pages/Certificate';
import Analytics from './pages/Analytics';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import EditProfile from "./pages/EditProfile";
import CertificatePage from "./pages/CertificatePage";



export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path='/exam/:step' element={<ProtectedRoute><Exam /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/certificate/:id" element={<Certificate cert={{
          step: 0
        }} />} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
