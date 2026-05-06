/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import MyAccount from './pages/MyAccount';
import ChatPage from './pages/Chat';
import Checkout from './pages/Checkout';
import JDMOrders from './pages/JDMOrders';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-nordic-snow">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nordic-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-serif italic text-nordic-ink/60">FutureMotors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/jdm-orders" element={<JDMOrders />} />
          <Route path="/checkout/:listingId" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="py-12 bg-nordic-ink text-nordic-snow px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif">FutureMotors</h3>
            <p className="text-nordic-snow/60 text-sm">Premium Nordic car care delivered to your doorstep. Trust, efficiency, and excellence.</p>
          </div>
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-widest mb-4 opacity-50">Services</h4>
            <ul className="space-y-2 text-sm text-nordic-snow/80">
              <li><Link to="/book" className="hover:text-nordic-blue transition-colors">Mobile Cleaning</Link></li>
              <li><Link to="/book" className="hover:text-nordic-blue transition-colors">Ceramic Coating</Link></li>
              <li><Link to="/book" className="hover:text-nordic-blue transition-colors">Tyre Hotel</Link></li>
              <li><Link to="/book" className="hover:text-nordic-blue transition-colors">Pick & Drop Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-widest mb-4 opacity-50">Marketplace</h4>
            <ul className="space-y-2 text-sm text-nordic-snow/80">
              <li><Link to="/marketplace?filter=cars" className="hover:text-nordic-blue transition-colors">Browse Cars</Link></li>
              <li><Link to="/marketplace?filter=accessories" className="hover:text-nordic-blue transition-colors">Accessories</Link></li>
              <li><Link to="/marketplace" className="hover:text-nordic-blue transition-colors">Sell Your Car</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold uppercase text-xs tracking-widest mb-4 opacity-50">Contact</h4>
            <ul className="space-y-2 text-sm text-nordic-snow/80">
              <li><a href="mailto:support@futuremotors.se" className="hover:text-nordic-blue transition-colors">support@futuremotors.se</a></li>
              <li><a href="tel:+46123456789" className="hover:text-nordic-blue transition-colors">+46 123 456 789</a></li>
              <li>Stockholm, Sweden</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-xs opacity-40">
          <p>© 2026 FutureMotors AB. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-nordic-blue transition-colors">Privacy Policy</button>
            <button className="hover:text-nordic-blue transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
