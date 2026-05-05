import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Car, MapPin, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Sparkles, Clock, ShieldCheck, Globe } from 'lucide-react';
import { SERVICES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Handle pre-selected service from query params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    if (serviceId && SERVICES.find(s => s.id === serviceId)) {
      setSelectedServices([serviceId]);
    }
  }, []);

  const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: '', plate: '', vin: '', isJapaneseImport: false });
  const [details, setDetails] = useState({ address: '', city: '', date: '', time: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalPrice = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to complete your booking');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        customerId: user.uid,
        serviceIds: selectedServices,
        vehicle: vehicleInfo,
        location: { address: details.address, city: details.city },
        scheduledAt: new Date(`${details.date}T${details.time}`),
        status: 'pending',
        totalPrice,
        notes: details.notes,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'appointments'), bookingData);
      toast.success('Service booked! We will contact you to confirm.');
      navigate('/account');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-nordic-snow py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif">Book a Service</h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 w-12 rounded-full ${step >= i ? 'bg-nordic-ink' : 'bg-nordic-slate/10'}`} />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-serif">Select Services</h2>
                    <p className="text-sm text-nordic-ink/60 font-light">Choose what your car needs today. Select multiple for a full treatment.</p>
                  </div>
                  <div className="grid gap-4">
                    {SERVICES.map(service => (
                      <div 
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedServices.includes(service.id) ? 'border-nordic-ink bg-white ring-4 ring-nordic-ink/5' : 'border-transparent bg-white hover:border-nordic-slate/20'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedServices.includes(service.id) ? 'bg-nordic-ink text-nordic-snow' : 'bg-nordic-snow text-nordic-blue'}`}>
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold">{service.name}</h3>
                            <p className="text-xs text-nordic-ink/50">{service.category}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                           <span className="font-mono text-lg">${service.price}</span>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedServices.includes(service.id) ? 'bg-nordic-ink border-nordic-ink text-white' : 'border-nordic-slate/10'}`}>
                             {selectedServices.includes(service.id) && <CheckCircle2 size={14} />}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-serif">Vehicle Information</h2>
                    <p className="text-sm text-nordic-ink/60 font-light">Which car should we look forward to meeting?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Make</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Volvo" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                        value={vehicleInfo.make}
                        onChange={(e) => setVehicleInfo({...vehicleInfo, make: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Model</label>
                      <input 
                        type="text" 
                        placeholder="e.g. XC90" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                        value={vehicleInfo.model}
                        onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Year</label>
                      <input 
                        type="number" 
                        placeholder="2024" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                        value={vehicleInfo.year}
                        onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">License Plate</label>
                      <input 
                        type="text" 
                        placeholder="NORDIC-1" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                        value={vehicleInfo.plate}
                        onChange={(e) => setVehicleInfo({...vehicleInfo, plate: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">VIN (Unique ID)</label>
                      <input 
                        type="text" 
                        placeholder="17-Character VIN" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                        value={vehicleInfo.vin || ''}
                        onChange={(e) => setVehicleInfo({...vehicleInfo, vin: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="col-span-2 pt-2">
                      <label className="flex items-center gap-3 p-4 bg-nordic-snow rounded-2xl cursor-pointer hover:bg-nordic-slate/5 transition-all border border-transparent hover:border-nordic-slate/10">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-nordic-slate/20 text-nordic-blue focus:ring-nordic-blue"
                          checked={vehicleInfo.isJapaneseImport}
                          onChange={(e) => setVehicleInfo({...vehicleInfo, isJapaneseImport: e.target.checked})}
                        />
                        <div className="flex items-center gap-2">
                          <Globe className="text-nordic-blue" size={18} />
                          <div>
                            <p className="text-sm font-bold">Imported from Japan (JDM)</p>
                            <p className="text-[10px] opacity-50 uppercase font-bold tracking-wider">Special requirements for service of Japanese import vehicles</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                 <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-serif">Location & Schedule</h2>
                    <p className="text-sm text-nordic-ink/60 font-light">Where and when should we arrive?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Address</label>
                        <input 
                          type="text" 
                          placeholder="Street name and number" 
                          className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                          value={details.address}
                          onChange={(e) => setDetails({...details, address: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">City</label>
                        <input 
                          type="text" 
                          placeholder="City" 
                          className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                          value={details.city}
                          onChange={(e) => setDetails({...details, city: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Date</label>
                        <input 
                          type="date" 
                          className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                          value={details.date}
                          onChange={(e) => setDetails({...details, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-50 pl-1">Time</label>
                        <select 
                          className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-white focus:ring-2 ring-nordic-blue/20 outline-none"
                          value={details.time}
                          onChange={(e) => setDetails({...details, time: e.target.value})}
                        >
                          <option value="">Select time</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="13:00">01:00 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="17:00">05:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-serif">Review & Confirmation</h2>
                    <p className="text-sm text-nordic-ink/60 font-light">Everything looks correct?</p>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 border border-nordic-slate/10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Scheduled For</p>
                        <p className="font-serif text-lg">{vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>
                        <p className="text-sm text-nordic-ink/60">{details.address}, {details.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Date & Time</p>
                        <p className="font-medium">{details.date} at {details.time}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-40">Services Selected</p>
                      <div className="space-y-2">
                        {SERVICES.filter(s => selectedServices.includes(s.id)).map(s => (
                          <div key={s.id} className="flex justify-between text-sm">
                            <span>{s.name}</span>
                            <span className="font-mono">${s.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-nordic-slate/5 flex justify-between items-center bg-nordic-snow -mx-8 px-8 py-4 mt-4">
                        <span className="font-bold">Total Estimated Price</span>
                        <span className="text-2xl font-serif tracking-tighter">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 pl-1">Additional Notes</label>
                      <textarea 
                        placeholder="Any special instructions for our team? (e.g. gate code, key location)" 
                        className="w-full p-4 rounded-xl border border-nordic-slate/10 bg-nordic-snow/50 focus:ring-2 ring-nordic-blue/20 outline-none text-sm min-h-[100px]"
                        value={details.notes}
                        onChange={(e) => setDetails({...details, notes: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-nordic-blue/5 rounded-2xl text-nordic-blue">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-medium">
                      Payment will be processed securely after the service is completed to your satisfaction. You will receive a summary and link to pay via our app or at the doorstep.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex justify-between">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-medium hover:bg-nordic-slate/5 transition-colors"
                >
                  <ChevronLeft size={20} /> Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button 
                  onClick={nextStep}
                  disabled={step === 1 && selectedServices.length === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-nordic-ink text-nordic-snow rounded-full font-bold active:scale-95 transition-all shadow-md shadow-nordic-ink/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-10 py-3 bg-nordic-blue text-white rounded-full font-bold active:scale-95 transition-all shadow-lg shadow-nordic-blue/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'} <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-nordic-slate/10 space-y-6 sticky top-24">
              <h3 className="font-serif text-xl border-b border-nordic-slate/5 pb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                 {selectedServices.length === 0 ? (
                   <p className="text-sm text-nordic-ink/40 italic">No services selected yet.</p>
                 ) : (
                   <ul className="space-y-3">
                     {SERVICES.filter(s => selectedServices.includes(s.id)).map(s => (
                       <li key={s.id} className="flex justify-between text-sm group">
                         <span className="opacity-60">{s.name}</span>
                         <span className="font-mono font-medium">${s.price}</span>
                       </li>
                     ))}
                   </ul>
                 )}
              </div>

              <div className="pt-4 border-t border-nordic-slate/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-60">Subtotal</span>
                  <span className="font-mono">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-nordic-blue">
                  <span className="text-sm font-bold">Booking Fee</span>
                  <span className="font-mono">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-serif underline decoration-nordic-blue/30 underline-offset-4">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-30">
                  <Clock size={12} /> Estimated Duration: {SERVICES.filter(s => selectedServices.includes(s.id)).reduce((a, b) => a + b.duration, 0)} mins
                </div>
              </div>
            </div>

            <div className="p-6 bg-nordic-ink/5 rounded-3xl border border-nordic-ink/5 space-y-3">
               <h4 className="font-bold text-xs uppercase tracking-widest opacity-40">FutureMotors Guarantee</h4>
               <p className="text-xs leading-relaxed opacity-60">All our mobile workshops are fully insured and staff are background checked. We use only premium industrial grade Nordic products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
