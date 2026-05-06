import React from 'react';
import { X, MessageCircle, ShoppingCart, Heart, Share2, Shield, Globe, Info, Calendar, Gauge, Cog, CreditCard, Droplets, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-nordic-ink/60 dark:bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-nordic-snow dark:bg-[#161B22] w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col md:flex-row transition-colors"
      >
        {/* Left Side: Images */}
        <div className="w-full md:w-3/5 bg-nordic-ink dark:bg-black relative">
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
        <div className="flex-grow p-10 overflow-y-auto space-y-8 bg-white dark:bg-[#161B22]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${listing.status === 'sold' ? 'bg-red-500 text-white' : 'bg-nordic-blue/10 text-nordic-blue dark:bg-nordic-blue/20 dark:text-nordic-dark-blue'}`}>
                    {listing.status === 'sold' ? 'SOLD' : listing.type}
                 </span>
                 {listing.isJapaneseImport && (
                    <span className="px-3 py-1 bg-nordic-blue text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                       <Globe size={10} /> JDM Import
                    </span>
                 )}
              </div>
              <h2 className="text-4xl font-serif tracking-tight dark:text-nordic-dark-ink">{listing.title}</h2>
              <p className="text-nordic-ink/40 dark:text-nordic-dark-ink/40 font-medium">Stockholm, Sweden • Verified Listing</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-nordic-snow dark:hover:bg-white/5 rounded-full text-nordic-ink/20 hover:text-nordic-ink dark:hover:text-nordic-dark-ink transition-all hidden md:block"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-baseline gap-4 border-b border-nordic-slate/10 dark:border-white/5 pb-8">
             <span className="text-4xl font-mono font-bold text-nordic-blue dark:text-nordic-dark-blue">€{listing.price.toLocaleString()}</span>
             <span className="text-nordic-ink/40 dark:text-nordic-dark-ink/40 line-through text-xl opacity-50">€{(listing.price * 1.05).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-nordic-snow dark:bg-white/5 rounded-3xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Condition</p>
                <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.condition || 'Showroom Quality'}</p>
             </div>
             <div className="p-4 bg-nordic-snow dark:bg-white/5 rounded-3xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Availability</p>
                <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.availability || 'Next Day Handover'}</p>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Detailed Specifications</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Calendar size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Year</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.year || '2023'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Gauge size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Mileage</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.mileage || '12,400'} km</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Cog size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Transmission</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.transmission || 'Automatic'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Info size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Fuel Type</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.fuelType || 'Petrol / Hybrid'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Zap size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Engine Size</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.engineSize || '2.0L'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Droplets size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Efficiency</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.efficiency || '6.5L/100km'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Shield size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Drivetrain</p>
                      <p className="font-bold dark:text-nordic-dark-ink">{listing.specs?.drivetrain || 'AWD'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl md:col-span-2">
                   <div className="p-2 bg-white dark:bg-[#0F1115] rounded-xl text-nordic-blue shadow-sm">
                      <Info size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 dark:text-nordic-dark-ink">Vehicle Identification Number (VIN)</p>
                      <p className="font-mono font-bold dark:text-nordic-dark-ink">{listing.vin || 'FutureMotors Certified'}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-4 p-6 bg-nordic-snow dark:bg-white/5 rounded-[32px] border border-nordic-slate/5 dark:border-white/5">
             <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Seller's Description</h3>
             <p className="text-nordic-ink/70 dark:text-nordic-dark-ink/70 leading-relaxed font-light italic">"{listing.description}"</p>
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
               className="flex-grow py-5 bg-nordic-ink dark:bg-nordic-dark-snow text-nordic-snow dark:text-white rounded-3xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
             >
                <MessageCircle size={20} /> {listing.status === 'sold' ? 'Sold Out' : 'Negotiate'}
             </button>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 opacity-40 dark:text-nordic-dark-ink">
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity"><Heart size={14} /> Add to Watchlist</button>
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity"><Share2 size={14} /> Share Listing</button>
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity"><Shield size={14} /> Report Issue</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
