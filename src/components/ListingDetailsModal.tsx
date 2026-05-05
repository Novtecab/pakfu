import React from 'react';
import { X, MessageCircle, ShoppingCart, Heart, Share2, Shield, Globe, Info, Calendar, Gauge, Cog, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketplaceListing } from '../types';
import { useNavigate } from 'react-router-dom';

interface ListingDetailsModalProps {
  listing: MarketplaceListing | null;
  onClose: () => void;
}

export default function ListingDetailsModal({ listing, onClose }: ListingDetailsModalProps) {
  const navigate = useNavigate();
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-nordic-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-nordic-snow w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Images */}
        <div className="w-full md:w-3/5 bg-nordic-ink relative">
           <button 
             onClick={onClose}
             className="absolute top-6 left-6 z-10 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all md:hidden"
           >
             <X size={20} />
           </button>
           
           <div className="h-full overflow-y-auto scrollbar-hide">
              {listing.images && listing.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                   {listing.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`${listing.title} - ${i + 1}`} 
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                   ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20">
                   <Globe size={120} />
                </div>
              )}
           </div>
        </div>

        {/* Right Side: Info */}
        <div className="flex-grow p-10 overflow-y-auto space-y-8 bg-white">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${listing.status === 'sold' ? 'bg-red-500 text-white' : 'bg-nordic-blue/10 text-nordic-blue'}`}>
                    {listing.status === 'sold' ? 'SOLD' : listing.type}
                 </span>
                 {listing.isJapaneseImport && (
                    <span className="px-3 py-1 bg-nordic-blue text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                       <Globe size={10} /> JDM Import
                    </span>
                 )}
              </div>
              <h2 className="text-4xl font-serif tracking-tight">{listing.title}</h2>
              <p className="text-nordic-ink/40 font-medium">Stockholm, Sweden • Verified Listing</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-nordic-snow rounded-full text-nordic-ink/20 hover:text-nordic-ink transition-all hidden md:block"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-baseline gap-4 border-b border-nordic-slate/10 pb-8">
             <span className="text-4xl font-mono font-bold text-nordic-blue">${listing.price.toLocaleString()}</span>
             <span className="text-nordic-ink/40 line-through text-xl opacity-50">${(listing.price * 1.05).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-nordic-snow rounded-3xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Condition</p>
                <p className="font-bold">Showroom Quality</p>
             </div>
             <div className="p-4 bg-nordic-snow rounded-3xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Availability</p>
                <p className="font-bold">Next Day Handover</p>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Detailed Specifications</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between items-center border-b border-nordic-slate/5 py-2">
                   <span className="opacity-40">Vehicle ID / VIN</span>
                   <span className="font-mono font-bold text-nordic-blue">{listing.vin || 'Not Distributed'}</span>
                </div>
                {listing.type === 'car' && (
                  <>
                    <div className="flex justify-between items-center border-b border-nordic-slate/5 py-2">
                       <span className="opacity-40">Year</span>
                       <span className="font-bold">2023</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-nordic-slate/5 py-2">
                       <span className="opacity-40">Mileage</span>
                       <span className="font-bold">12,400 km</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-nordic-slate/5 py-2">
                       <span className="opacity-40">Transmission</span>
                       <span className="font-bold">Automatic</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center border-b border-nordic-slate/5 py-2">
                   <span className="opacity-40">Listed Date</span>
                   <span className="font-bold">May 4, 2026</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Seller's Description</h3>
             <p className="text-nordic-ink/70 leading-relaxed font-light italic">"{listing.description}"</p>
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-4">
             <button 
               onClick={() => navigate(`/checkout/${listing.id}`)}
               disabled={listing.status === 'sold'}
               className="flex-grow py-5 bg-nordic-blue text-white rounded-3xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
             >
                <CreditCard size={20} /> {listing.status === 'sold' ? 'Sold' : 'Buy Now'}
             </button>
             <button 
               onClick={() => navigate(`/chat?listing=${listing.id}`)}
               disabled={listing.status === 'sold'}
               className="flex-grow py-5 bg-nordic-ink text-nordic-snow rounded-3xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
             >
                <MessageCircle size={20} /> {listing.status === 'sold' ? 'Sold Out' : 'Negotiate'}
             </button>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 opacity-40">
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100"><Heart size={14} /> Add to Watchlist</button>
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100"><Share2 size={14} /> Share Listing</button>
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100"><Shield size={14} /> Report Issue</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
