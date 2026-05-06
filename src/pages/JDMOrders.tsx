import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Globe, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const JDM_MODELS = [
  {
    id: 'r34',
    name: 'Nissan Skyline GT-R (R34)',
    image: 'https://images.unsplash.com/photo-1621649195329-a17f22312d8a?auto=format&fit=crop&q=80',
    description: 'The "Godzilla" of the tuner world. Direct sourcing from Osaka auctions.',
    avgPrice: '95,000'
  },
  {
    id: 'supra',
    name: 'Toyota Supra (A80)',
    image: 'https://images.unsplash.com/photo-1622343888362-e616f7311ce8?auto=format&fit=crop&q=80',
    description: 'Iconic 2JZ-GTE reliability. Clean samples sourced with auction grade 4+.',
    avgPrice: '82,000'
  },
  {
    id: 'rx7',
    name: 'Mazda RX-7 (FD3S)',
    image: 'https://images.unsplash.com/photo-1598551401398-356b2f48dce5?auto=format&fit=crop&q=80',
    description: 'Rotary masterpiece. We specialize in non-modified chassis preservation.',
    avgPrice: '55,000'
  },
  {
    id: 'nsx',
    name: 'Honda NSX (NA1/NA2)',
    image: 'https://images.unsplash.com/photo-1598551400262-b13c3b018591?auto=format&fit=crop&q=80',
    description: 'The Japanese Ferrari. Sourced directly from collectors in Nagoya.',
    avgPrice: '110,000'
  },
  {
    id: 'ae86',
    name: 'Toyota Corolla Levin/Trueno (AE86)',
    image: 'https://images.unsplash.com/photo-1598551400262-b13c3b018591?auto=format&fit=crop&q=80',
    description: 'The drift king. Light-weight, high-revving 4A-GE engines sourced from Gunma tracks.',
    avgPrice: '35,000'
  },
  {
    id: 'evo9',
    name: 'Mitsubishi Lancer Evolution IX MR',
    image: 'https://images.unsplash.com/photo-1622343888362-e616f7311ce8?auto=format&fit=crop&q=80',
    description: 'The pinnacle of MIVEC performance. MR editions sourced with pristine service histories.',
    avgPrice: '62,000'
  }
];

const JDMOrders = () => {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    requirements: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }
    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'jdm_orders'), {
        userId: user.uid,
        userEmail: user.email,
        modelId: selectedModel,
        modelName: JDM_MODELS.find(m => m.id === selectedModel)?.name,
        budget: formData.budget,
        requirements: formData.requirements,
        phone: formData.phone,
        status: 'pending_review',
        paymentTerms: '60/40',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      toast.success('Inquiry submitted!');
    } catch (error) {
      toast.error('Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-nordic-snow dark:bg-[#0F1115] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full nordic-card p-12 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-nordic-blue rounded-full flex items-center justify-center mx-auto text-white">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif dark:text-nordic-dark-ink">Inquiry Received</h2>
          <p className="text-nordic-ink/60 dark:text-nordic-dark-ink/60 font-light">
            Our specialized JDM procurement team will review your requirements and contact you within 24 hours.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full py-4 bg-nordic-ink dark:bg-nordic-blue text-white rounded-2xl font-bold"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-snow dark:bg-[#0F1115] py-20 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-nordic-slate/10 dark:border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-nordic-blue dark:text-nordic-dark-blue">
              <Globe size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Global Sourcing</span>
            </div>
            <h1 className="text-6xl font-serif tracking-tighter dark:text-nordic-dark-ink">Direct JDM Import</h1>
            <p className="text-nordic-ink/60 dark:text-nordic-dark-ink/40 max-w-xl font-light">
              We source verified vehicles directly from Japanese auctions (USS, TAA, JU) and private collectors. Pure provenance, professional logistics.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Models Grid */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-serif dark:text-nordic-dark-ink">Specialized Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {JDM_MODELS.map(model => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`nordic-card group overflow-hidden cursor-pointer transition-all ${selectedModel === model.id ? 'ring-4 ring-nordic-blue' : ''}`}
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={model.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="font-serif text-xl dark:text-nordic-dark-ink">{model.name}</h4>
                    <p className="text-xs opacity-60 line-clamp-2 dark:text-nordic-dark-ink/60">{model.description}</p>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Estimated Price</span>
                       <span className="font-mono font-bold text-nordic-blue dark:text-nordic-dark-blue">€{model.avgPrice}+</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 bg-nordic-ink text-white rounded-[40px] space-y-6">
               <h3 className="text-2xl font-serif">Sourcing Process</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">1</div>
                     <p className="font-bold text-sm">Consultation</p>
                     <p className="text-xs opacity-50">We define your requirements, budget, and desired auction grade.</p>
                  </div>
                  <div className="space-y-2">
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">2</div>
                     <p className="font-bold text-sm">Bidding</p>
                     <p className="text-xs opacity-50">Our agents in Japan inspect vehicles on-site before we bid on your behalf.</p>
                  </div>
                  <div className="space-y-2">
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">3</div>
                     <p className="font-bold text-sm">Logistics</p>
                     <p className="text-xs opacity-50">Customs clearance, deregistration, and insured ocean freight to your port.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
             <div className="nordic-card p-10 space-y-8 sticky top-24">
                <div className="space-y-2">
                   <h3 className="text-2xl font-serif dark:text-nordic-dark-ink">Place Import Order</h3>
                   <p className="text-xs opacity-50 dark:text-nordic-dark-ink/50 uppercase font-bold tracking-widest">Inquiry Form</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Target Budget (€)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 60000" 
                      className="w-full p-4 rounded-xl bg-nordic-snow dark:bg-white/5 border border-transparent focus:border-nordic-blue outline-none transition-all dark:text-nordic-dark-ink"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="+46..." 
                      className="w-full p-4 rounded-xl bg-nordic-snow dark:bg-white/5 border border-transparent focus:border-nordic-blue outline-none transition-all dark:text-nordic-dark-ink"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-nordic-dark-ink">Specific Requirements</label>
                    <textarea 
                      placeholder="Color, mileage maximum, auction grade..." 
                      className="w-full p-4 rounded-xl bg-nordic-snow dark:bg-white/5 border border-transparent focus:border-nordic-blue outline-none transition-all min-h-[100px] dark:text-nordic-dark-ink"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    />
                  </div>

                  <div className="p-6 bg-nordic-blue/5 dark:bg-nordic-blue/10 rounded-2xl border border-nordic-blue/10 space-y-4">
                     <div className="flex items-center gap-3 text-nordic-blue">
                        <CreditCard size={18} />
                        <h4 className="font-bold text-sm">Payment Structure</h4>
                     </div>
                     <div className="space-y-2 text-[11px] leading-relaxed dark:text-nordic-dark-ink/60">
                        <div className="flex justify-between font-bold">
                           <span>Initial Deposit</span>
                           <span className="text-nordic-blue">60%</span>
                        </div>
                        <p className="opacity-60">Required to secure vehicle and initiate ocean freight insurance.</p>
                        <hr className="border-nordic-blue/10" />
                        <div className="flex justify-between font-bold">
                           <span>Pre-Delivery</span>
                           <span className="text-nordic-blue">40%</span>
                        </div>
                        <p className="opacity-60">Payable after local customs clearance and before final doorstep delivery.</p>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-nordic-ink dark:bg-nordic-blue text-white rounded-2xl font-bold shadow-xl shadow-nordic-ink/10 flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Request Sourcing Slot <ChevronRight size={18}/></>}
                  </button>
                </form>

                <div className="flex items-start gap-3 p-4 bg-nordic-snow dark:bg-white/5 rounded-2xl">
                   <ShieldCheck size={20} className="text-nordic-blue flex-shrink-0" />
                   <p className="text-[10px] opacity-60 leading-relaxed dark:text-nordic-dark-ink/60">
                     FutureMotors Protected: We hold all funds in escrow. Deposits are 100% refundable if the vehicle fails out-bound Japanese inspection.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDMOrders;
