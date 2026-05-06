import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import ImageGenerator from './ImageGenerator';
import toast from 'react-hot-toast';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'car' | 'accessory';
}

export default function CreateListingModal({ isOpen, onClose, type }: CreateListingModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isJapaneseImport: false,
    specs: {
      year: '2023',
      mileage: '',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      engineSize: '',
      efficiency: '',
      drivetrain: 'AWD',
      condition: 'Showroom Quality',
      availability: 'Next Day Handover'
    }
  });
  const [images, setImages] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.price) {
      toast.error('Please fill in title and price');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        price: parseFloat(formData.price),
        type,
        images,
        sellerId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      toast.success('Listing created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = (url: string) => {
    setImages(prev => [...prev, url]);
    setShowAI(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-nordic-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-nordic-snow dark:bg-[#0F1115] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col md:flex-row transition-colors"
      >
        {/* Left Side: Form */}
        <div className="flex-grow p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-serif dark:text-nordic-dark-info">List your {type}</h2>
            <button onClick={onClose} className="p-2 hover:bg-nordic-slate/10 dark:hover:bg-white/5 rounded-full dark:text-nordic-dark-ink">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 2023 Porsche 911 Carrera"
                className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-2xl p-4 dark:text-nordic-dark-ink"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Description</label>
              <textarea
                required
                placeholder="Describe your vehicle's features, history, and status..."
                className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-2xl p-4 min-h-[100px] dark:text-nordic-dark-ink"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Price (€)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-2xl p-4 dark:text-nordic-dark-ink"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              {type === 'car' && (
                 <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Vehicle Origin</label>
                 <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isJapaneseImport: !formData.isJapaneseImport })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      formData.isJapaneseImport 
                        ? 'border-nordic-blue bg-nordic-blue/5 dark:bg-nordic-blue/10 text-nordic-blue' 
                        : 'border-nordic-slate/10 dark:border-white/5 bg-white dark:bg-[#161B22] opacity-60'
                    }`}
                 >
                    <span className="text-sm font-bold dark:text-nordic-dark-ink">JDM Import</span>
                    <Globe size={18} />
                 </button>
               </div>
              )}
            </div>

            {type === 'car' && (
              <div className="space-y-6 pt-4 border-t border-nordic-slate/10 dark:border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Detailed Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Year</label>
                    <input 
                      type="text" 
                      placeholder="2023"
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.year}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, year: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Mileage (km)</label>
                    <input 
                      type="text" 
                      placeholder="12,500"
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.mileage}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, mileage: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Transmission</label>
                    <select 
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.transmission}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, transmission: e.target.value } })}
                    >
                      <option>Automatic</option>
                      <option>Manual</option>
                      <option>Semi-Auto</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Fuel Type</label>
                    <select 
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.fuelType}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, fuelType: e.target.value } })}
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Engine Size</label>
                    <input 
                      type="text" 
                      placeholder="2.0L / 3.0L V6"
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.engineSize}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, engineSize: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Fuel Efficiency</label>
                    <input 
                      type="text" 
                      placeholder="6.5L/100km"
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.efficiency}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, efficiency: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30 dark:text-nordic-dark-ink">Drivetrain</label>
                    <select 
                      className="w-full bg-white dark:bg-[#161B22] border border-nordic-slate/10 dark:border-white/5 rounded-xl p-3 text-sm dark:text-nordic-dark-ink"
                      value={formData.specs.drivetrain}
                      onChange={e => setFormData({ ...formData, specs: { ...formData.specs, drivetrain: e.target.value } })}
                    >
                      <option>AWD</option>
                      <option>RWD</option>
                      <option>FWD</option>
                      <option>4WD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-nordic-ink dark:bg-nordic-blue text-nordic-snow dark:text-white font-bold py-5 rounded-3xl hover:shadow-xl transition-all disabled:opacity-50"
            >
              Post Listing
            </button>
          </form>
        </div>

        {/* Right Side: Media */}
        <div className="w-full md:w-[400px] bg-white dark:bg-[#161B22] border-l border-nordic-slate/10 dark:border-white/5 p-10 overflow-y-auto space-y-8">
           <header className="space-y-1">
              <h3 className="text-xl font-serif dark:text-nordic-dark-ink">Visuals & Media</h3>
              <p className="text-xs opacity-50 dark:text-nordic-dark-ink/50">Generate or upload high-res images.</p>
           </header>

           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                 {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-nordic-snow relative group">
                       <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       <button 
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                          <X size={16} />
                       </button>
                    </div>
                 ))}
                 <button 
                    onClick={() => setShowAI(true)}
                    className="aspect-square rounded-xl border-2 border-dashed border-nordic-slate/20 dark:border-white/10 flex flex-col items-center justify-center gap-2 hover:border-nordic-blue transition-all group"
                 >
                    <Plus className="text-nordic-slate/40 dark:text-white/20 group-hover:text-nordic-blue" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:opacity-20 group-hover:opacity-100 dark:text-nordic-dark-ink">Add AI Visual</span>
                 </button>
              </div>

              <AnimatePresence>
                {showAI && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="pt-4"
                  >
                    <ImageGenerator onImageGenerated={addImage} defaultPrompt={formData.title} />
                    <button onClick={() => setShowAI(false)} className="w-full mt-2 text-[10px] font-bold uppercase opacity-30 hover:opacity-100">Cancel AI</button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
