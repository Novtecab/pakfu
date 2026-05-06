import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Tag, Info, ShoppingCart, MessageCircle, Heart, Camera, Plus, ChevronRight, Car, Package, Globe, X, Moon, Sun } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MarketplaceListing } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateListingModal from '../components/CreateListingModal';
import ListingDetailsModal from '../components/ListingDetailsModal';

const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<'car' | 'accessory'>('car');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [showJapaneseOnly, setShowJapaneseOnly] = useState(false);
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
    window.dispatchEvent(new Event('themeChange'));
  };

  useEffect(() => {
    const handleThemeEvent = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('themeChange', handleThemeEvent);
    return () => window.removeEventListener('themeChange', handleThemeEvent);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MarketplaceListing[];
      setListings(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredListings = listings.filter(l => 
    l.type === tab && 
    (l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     l.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!showJapaneseOnly || l.isJapaneseImport)
  );

  return (
    <div className="min-h-screen bg-nordic-snow dark:bg-[#0F1115] py-20 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-nordic-ink dark:text-nordic-dark-ink">
          <div className="space-y-4">
             <h1 className="text-6xl font-serif tracking-tighter">Marketplace</h1>
             <p className="text-nordic-ink/60 dark:text-nordic-dark-ink/60 max-w-xl font-light">Handpicked premium cars and high-quality accessories from the FutureMotors community.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-4 bg-nordic-ink dark:bg-nordic-blue text-nordic-snow dark:text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95"
            >
               <Plus size={20} /> List Your Item
            </button>
            <button 
              onClick={toggleTheme}
              className="p-4 bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-full text-nordic-ink dark:text-nordic-dark-ink hover:bg-nordic-slate/5 dark:hover:bg-white/5 transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nordic-ink/30 dark:text-nordic-dark-ink/30 group-focus-within:text-nordic-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 focus:ring-2 ring-nordic-blue/20 outline-none text-sm transition-all dark:text-nordic-dark-ink"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nordic-ink/30 hover:text-nordic-blue transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 pl-2 dark:text-nordic-dark-ink">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setTab('car')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'car' ? 'bg-nordic-ink dark:bg-nordic-blue text-nordic-snow' : 'bg-white dark:bg-[#161B22] text-nordic-ink/60 dark:text-nordic-dark-ink/60 hover:bg-nordic-slate/5 dark:hover:bg-white/5'}`}
                >
                  <Car size={18} /> Premium Cars
                </button>
                <button 
                  onClick={() => setTab('accessory')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === 'accessory' ? 'bg-nordic-ink dark:bg-nordic-blue text-nordic-snow' : 'bg-white dark:bg-[#161B22] text-nordic-ink/60 dark:text-nordic-dark-ink/60 hover:bg-nordic-slate/5 dark:hover:bg-white/5'}`}
                >
                  <Package size={18} /> Accessories
                </button>
              </div>
            </div>

            {tab === 'car' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 pl-2 dark:text-nordic-dark-ink">Vehicle Origin</h3>
                <button 
                  onClick={() => setShowJapaneseOnly(!showJapaneseOnly)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border ${showJapaneseOnly ? 'bg-nordic-blue text-white border-nordic-blue' : 'bg-white dark:bg-[#161B22] text-nordic-ink/60 dark:text-nordic-dark-ink/40 border-nordic-slate/10 dark:border-white/5 hover:bg-nordic-slate/5 dark:hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} /> JDM Listings Only
                  </div>
                  {showJapaneseOnly && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </button>
              </div>
            )}

            <div className="p-6 bg-nordic-blue text-white rounded-3xl space-y-4 shadow-xl shadow-nordic-blue/20">
               <h4 className="font-serif text-xl">Get FutureMotors Verified</h4>
               <p className="text-xs opacity-80 leading-relaxed font-light">Boost your listing's value. Our staff comes to you for a 50-point mobile inspection and includes a "Verified" badge on your marketplace post.</p>
               <button onClick={() => navigate('/book?service=inspection')} className="w-full py-3 bg-white text-nordic-blue rounded-full text-xs font-bold hover:bg-nordic-snow transition-all">
                 Book Inspection
               </button>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-grow space-y-8">
            <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-nordic-ink/5 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest dark:text-nordic-dark-ink">
                  Total Results: <span className="text-nordic-blue dark:text-nordic-dark-blue font-bold">{filteredListings.length}</span>
               </div>
               
               {tab === 'car' && (
                 <button 
                    onClick={() => setShowJapaneseOnly(!showJapaneseOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      showJapaneseOnly 
                        ? 'bg-nordic-blue text-white shadow-lg shadow-nordic-blue/20' 
                        : 'bg-white dark:bg-[#161B22] text-nordic-ink/40 dark:text-nordic-dark-ink/40 border border-nordic-slate/10 dark:border-white/5'
                    }`}
                 >
                    <Globe size={14} /> JDM Focus
                 </button>
               )}
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-nordic-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white dark:bg-[#161B22] rounded-3xl p-20 text-center border border-dashed border-nordic-slate/20 dark:border-white/10">
                 <Search size={48} className="mx-auto text-nordic-ink/10 dark:text-white/10 mb-4" />
                 <h3 className="font-serif text-2xl mb-2 dark:text-nordic-dark-ink">No listings found</h3>
                 <p className="text-sm text-nordic-ink/40 dark:text-nordic-dark-ink/40">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`nordic-card group overflow-hidden flex flex-col ${listing.status === 'sold' ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop'} 
                        alt={listing.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest ${listing.status === 'sold' ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-nordic-dark-snow/90 text-nordic-ink dark:text-nordic-dark-ink'}`}>
                          {listing.status}
                        </span>
                        {listing.isJapaneseImport && (
                          <span className="px-3 py-1 bg-nordic-blue text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Globe size={10} /> JDM
                          </span>
                        )}
                      </div>
                      <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-nordic-dark-snow/90 backdrop-blur-sm rounded-full text-nordic-ink/60 dark:text-nordic-dark-ink/60 hover:text-red-500 transition-colors shadow-sm">
                        <Heart size={16} />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-grow flex flex-col dark:bg-[#161B22]">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-serif text-xl group-hover:text-nordic-blue transition-colors dark:text-nordic-dark-ink">{listing.title}</h3>
                          <p className="text-xs text-nordic-ink/40 dark:text-nordic-dark-ink/40 font-medium">Stockholm, SE</p>
                        </div>
                        <span className={`font-mono text-lg font-bold ${listing.status === 'sold' ? 'text-nordic-ink/40 line-through' : 'text-nordic-blue dark:text-nordic-dark-blue'}`}>
                          €{listing.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {listing.type === 'car' && (
                          <>
                            <span className="px-2 py-1 bg-nordic-snow dark:bg-white/5 rounded text-[10px] font-medium opacity-60 dark:text-nordic-dark-ink">{listing.specs?.year || '2023'}</span>
                            <span className="px-2 py-1 bg-nordic-snow dark:bg-white/5 rounded text-[10px] font-medium opacity-60 dark:text-nordic-dark-ink">{listing.specs?.mileage || '12,000'} km</span>
                            <span className="px-2 py-1 bg-nordic-snow dark:bg-white/5 rounded text-[10px] font-medium opacity-60 dark:text-nordic-dark-ink">{listing.specs?.transmission || 'Auto'}</span>
                            <span className="px-2 py-1 bg-nordic-snow dark:bg-white/5 rounded text-[10px] font-medium opacity-60 dark:text-nordic-dark-ink">{listing.specs?.fuelType || 'Petrol'}</span>
                          </>
                        )}
                      </div>

                      <div className="pt-4 border-t border-nordic-slate/5 dark:border-white/5 mt-auto flex flex-col gap-2">
                         <button 
                           onClick={() => setSelectedListing(listing)}
                           className="w-full py-3 bg-nordic-ink dark:bg-nordic-blue text-nordic-snow dark:text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                         >
                           View Listing Details
                         </button>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/chat?listing=${listing.id}`)}
                            disabled={listing.status === 'sold'}
                            className="flex-grow flex items-center justify-center gap-2 py-3 bg-nordic-snow dark:bg-white/5 rounded-xl text-xs font-bold hover:bg-nordic-slate/10 dark:hover:bg-white/10 transition-all text-nordic-ink/60 dark:text-nordic-dark-ink/60 disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <MessageCircle size={16} /> {listing.status === 'sold' ? 'Sold' : 'Contact'}
                          </button>
                          <button 
                            disabled={listing.status === 'sold'}
                            className="p-3 bg-nordic-frost/10 text-nordic-frost dark:text-nordic-dark-frost rounded-xl hover:bg-nordic-frost hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                             <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={tab} 
      />

      <ListingDetailsModal 
        listing={selectedListing} 
        onClose={() => setSelectedListing(null)} 
      />
    </div>
  );
};


export default Marketplace;
