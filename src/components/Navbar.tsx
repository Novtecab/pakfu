import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, MessageCircle, LayoutDashboard, Calendar, Menu, X, LogIn, LogOut, Car, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { APP_NAME } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, isStaff } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Dispatch a custom event so other components (like Marketplace) can sync if they have local state
    window.dispatchEvent(new Event('themeChange'));
  };

  React.useEffect(() => {
    const handleThemeEvent = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themeChange', handleThemeEvent);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
    return () => window.removeEventListener('themeChange', handleThemeEvent);
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { name: 'Services', path: '/', icon: Calendar },
    { name: 'Marketplace', path: '/marketplace', icon: Car },
    { name: 'JDM Imports', path: '/jdm-orders', icon: Globe },
    { name: 'Book Now', path: '/book', icon: Calendar, highlight: true },
  ];

  if (isStaff) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-nordic-slate/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-nordic-ink rounded-lg flex items-center justify-center text-nordic-snow transition-transform group-hover:scale-105">
            <Car size={24} />
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-nordic-ink">FutureMotors</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors flex items-center gap-2",
                isActive(link.path) ? "text-nordic-blue" : "text-nordic-ink/70 hover:text-nordic-ink",
                link.highlight && "bg-nordic-ink text-nordic-snow px-4 py-2 rounded-full hover:bg-nordic-slate transition-all"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-nordic-slate/5 dark:hover:bg-nordic-dark-snow/20 rounded-full transition-colors text-nordic-ink dark:text-nordic-dark-ink"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/chat" className="p-2 hover:bg-nordic-slate/5 rounded-full relative transition-colors">
                <MessageCircle size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-nordic-blue rounded-full border-2 border-white" />
              </Link>
              <Link to="/account" className="flex items-center gap-2 p-1 pl-3 bg-nordic-snow border border-nordic-slate/10 rounded-full hover:bg-white transition-all">
                <div className="text-right">
                  <p className="text-xs font-bold leading-tight">{user.displayName?.split(' ')[0]}</p>
                </div>
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Avatar" className="w-8 h-8 rounded-full border border-white" />
              </Link>
              <button onClick={logout} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 px-6 py-2 bg-nordic-ink text-nordic-snow rounded-full text-sm font-bold active:scale-95 transition-all shadow-sm"
            >
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-nordic-ink" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-nordic-slate/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-lg font-serif font-medium",
                    isActive(link.path) ? "text-nordic-blue" : "text-nordic-ink"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold uppercase tracking-widest opacity-40">App Theme</span>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 bg-nordic-snow dark:bg-nordic-dark-snow rounded-full text-sm font-bold"
                >
                  {isDark ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
                </button>
              </div>
              <hr className="border-nordic-slate/10" />
              {user ? (
                <>
                  <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif font-medium">My Account</Link>
                  <button onClick={logout} className="text-lg font-serif font-medium text-red-500 text-left">Sign Out</button>
                </>
              ) : (
                <button onClick={login} className="text-lg font-serif font-medium text-nordic-blue text-left">Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
