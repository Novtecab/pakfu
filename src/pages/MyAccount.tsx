import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Car, Clock, Settings, LogOut, ChevronRight, History, Calendar, Star, Shield, MapPin, Bell, MessageCircle, Plus, Trash2, Edit2, Wrench, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Appointment, Vehicle, MaintenanceEntry } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyAccount = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'history' | 'settings'>('overview');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    isJapaneseImport: false
  });

  useEffect(() => {
    if (!user) return;
    const qAppts = query(
      collection(db, 'appointments'), 
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubAppts = onSnapshot(qAppts, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
    });

    const qVehicles = query(
      collection(db, 'vehicles'),
      where('ownerId', '==', user.uid)
    );
    const unsubVehicles = onSnapshot(qVehicles, (snapshot) => {
      setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[]);
    });

    return () => {
      unsubAppts();
      unsubVehicles();
    };
  }, [user]);

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const data = {
        ...vehicleForm,
        year: parseInt(vehicleForm.year),
        ownerId: user.uid,
        updatedAt: serverTimestamp()
      };

      if (editingVehicleId) {
        await updateDoc(doc(db, 'vehicles', editingVehicleId), data);
        toast.success('Vehicle updated');
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...data,
          createdAt: serverTimestamp(),
          maintenanceHistory: []
        });
        toast.success('Vehicle added');
      }
      resetVehicleForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const resetVehicleForm = () => {
    setVehicleForm({ make: '', model: '', year: '', licensePlate: '', vin: '', isJapaneseImport: false });
    setIsAddingVehicle(false);
    setEditingVehicleId(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin || '',
      isJapaneseImport: vehicle.isJapaneseImport || false
    });
    setEditingVehicleId(vehicle.id);
    setIsAddingVehicle(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      toast.success('Vehicle removed');
    } catch (error) {
      toast.error('Failed to remove vehicle');
    }
  };

  const addMaintenanceEntry = async (vehicleId: string) => {
    const service = prompt('Enter service description (e.g. Oil Change):');
    if (!service) return;
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    try {
      const entry: MaintenanceEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        service,
        notes: 'User added entry'
      };
      
      const updatedHistory = [...(vehicle.maintenanceHistory || []), entry];
      await updateDoc(doc(db, 'vehicles', vehicleId), {
        maintenanceHistory: updatedHistory
      });
      toast.success('Maintenance record added');
    } catch (error) {
      toast.error('Failed to add record');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-nordic-snow py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-8">
           <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-nordic-slate/10 shadow-sm">
             <div className="relative mb-4">
               <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-nordic-snow ring-1 ring-nordic-slate/10" />
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
             </div>
             <h2 className="font-serif text-2xl">{user.displayName}</h2>
             <p className="text-xs text-nordic-ink/40 font-medium tracking-widest uppercase mt-1">{profile?.role || 'Customer'}</p>
             <button className="mt-6 w-full py-3 bg-nordic-snow rounded-xl text-xs font-bold hover:bg-nordic-slate/5 transition-all">
                Edit Profile
             </button>
           </div>

           <nav className="space-y-1">
             {[
               { id: 'overview', name: 'Dashboard', icon: User },
               { id: 'vehicles', name: 'My Vehicles', icon: Car },
               { id: 'history', name: 'Service History', icon: History },
               { id: 'settings', name: 'Settings', icon: Settings },
             ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-nordic-ink text-nordic-snow shadow-lg shadow-nordic-ink/10' : 'text-nordic-ink/60 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} /> {item.name}
                  </div>
                  <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                </button>
             ))}
           </nav>

           <div className="bg-nordic-blue/5 p-6 rounded-3xl border border-nordic-blue/10">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-nordic-blue mb-3">
                <Bell size={14} /> Service Reminder
              </h4>
              <p className="text-xs leading-relaxed text-nordic-ink/70">
                Hi {user.displayName?.split(' ')[0]}, your seasonal tyre change is due in <span className="font-bold">12 days</span>. Book now to get 10% off!
              </p>
              <button className="mt-4 text-xs font-bold text-nordic-blue underline underline-offset-4">Book Now</button>
           </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3 space-y-12">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <header className="space-y-2">
                <h1 className="text-5xl font-serif tracking-tight">Active Appointments</h1>
                <p className="text-nordic-ink/60 font-light">Track your upcoming visits and mobile workshop requests.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 ? (
                  <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-nordic-slate/10 italic text-nordic-ink/40">
                    No active bookings. Ready for a clean?
                  </div>
                ) : (
                  appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').map(appt => (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-3xl border border-nordic-slate/10 shadow-sm relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-nordic-snow rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                      
                      <div className="relative space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-nordic-blue/10 text-nordic-blue text-[10px] font-bold uppercase tracking-widest rounded-full">
                              {appt.status}
                            </span>
                            <h3 className="text-2xl font-serif mt-2">Mobile Session</h3>
                          </div>
                          <Calendar className="text-nordic-ink/10" size={32} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-nordic-slate/5">
                           <div className="space-y-0.5">
                              <p className="text-[10px] uppercase font-bold opacity-30">Date</p>
                              <p className="font-medium">{format(new Date(appt.scheduledAt.seconds * 1000), 'PPP')}</p>
                           </div>
                           <div className="space-y-0.5 text-right">
                              <p className="text-[10px] uppercase font-bold opacity-30">Location</p>
                              <p className="font-medium inline-flex items-center gap-1"><MapPin size={12} /> {appt.location.city}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                           <div className="flex -space-x-2">
                             {[1,2].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full bg-nordic-snow border-2 border-white flex items-center justify-center text-nordic-ink/40">
                                 <Shield size={14} />
                               </div>
                             ))}
                           </div>
                           <p className="text-lg font-mono font-bold tracking-tighter">${appt.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-serif">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Add Vehicle', icon: Plus, onClick: () => { setActiveTab('vehicles'); setIsAddingVehicle(true); } },
                    { name: 'Notifications', icon: Bell, onClick: () => {} },
                    { name: 'Live Chat', icon: MessageCircle, onClick: () => {} },
                    { name: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
                  ].map((action, i) => (
                    <button 
                      key={i} 
                      onClick={action.onClick}
                      className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-nordic-slate/10 hover:border-nordic-blue/30 transition-all group"
                    >
                       <div className="w-10 h-10 bg-nordic-snow rounded-xl flex items-center justify-center group-hover:bg-nordic-blue group-hover:text-white transition-colors">
                         <action.icon size={20} />
                       </div>
                       <span className="text-xs font-bold tracking-tight opacity-60 uppercase">{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <header className="space-y-2">
                  <h1 className="text-5xl font-serif tracking-tight">Garage</h1>
                  <p className="text-nordic-ink/60 font-light">Manage your vehicles and their maintenance records.</p>
                </header>
                {!isAddingVehicle && (
                  <button 
                    onClick={() => setIsAddingVehicle(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-nordic-ink text-nordic-snow rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Plus size={18} /> Add New
                  </button>
                )}
              </div>

              {isAddingVehicle ? (
                <div className="bg-white rounded-3xl border border-nordic-slate/10 p-10">
                  <h3 className="text-2xl font-serif mb-8">{editingVehicleId ? 'Update Vehicle' : 'Register New Vehicle'}</h3>
                  <form onSubmit={handleVehicleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40">Make</label>
                      <input 
                        required
                        className="w-full bg-nordic-snow border border-transparent rounded-2xl p-4 focus:bg-white focus:border-nordic-blue/20 outline-none transition-all"
                        value={vehicleForm.make}
                        onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})}
                        placeholder="e.g. Volvo"
                      />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40">Model</label>
                      <input 
                        required
                        className="w-full bg-nordic-snow border border-transparent rounded-2xl p-4 focus:bg-white focus:border-nordic-blue/20 outline-none transition-all"
                        value={vehicleForm.model}
                        onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})}
                        placeholder="e.g. XC90"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40">Year</label>
                      <input 
                        type="number"
                        required
                        className="w-full bg-nordic-snow border border-transparent rounded-2xl p-4 focus:bg-white focus:border-nordic-blue/20 outline-none transition-all"
                        value={vehicleForm.year}
                        onChange={e => setVehicleForm({...vehicleForm, year: e.target.value})}
                        placeholder="2022"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40">License Plate</label>
                      <input 
                        required
                        className="w-full bg-nordic-snow border border-transparent rounded-2xl p-4 focus:bg-white focus:border-nordic-blue/20 outline-none transition-all"
                        value={vehicleForm.licensePlate}
                        onChange={e => setVehicleForm({...vehicleForm, licensePlate: e.target.value.toUpperCase()})}
                        placeholder="ABC 123"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40">VIN (Unique Identification)</label>
                      <input 
                        className="w-full bg-nordic-snow border border-transparent rounded-2xl p-4 focus:bg-white focus:border-nordic-blue/20 outline-none transition-all"
                        value={vehicleForm.vin}
                        onChange={e => setVehicleForm({...vehicleForm, vin: e.target.value.toUpperCase()})}
                        placeholder="Enter 17-character VIN"
                      />
                    </div>
                    <div className="col-span-2">
                       <label className="flex items-center gap-3 p-4 bg-nordic-snow rounded-2xl cursor-pointer hover:bg-nordic-slate/5 transition-all">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-nordic-slate/20 text-nordic-blue focus:ring-nordic-blue"
                          checked={vehicleForm.isJapaneseImport}
                          onChange={(e) => setVehicleForm({...vehicleForm, isJapaneseImport: e.target.checked})}
                        />
                        <div className="flex items-center gap-2">
                          <Globe className="text-nordic-blue" size={18} />
                          <span className="text-sm font-bold">Japanese Import (JDM)</span>
                        </div>
                      </label>
                    </div>
                    <div className="col-span-2 flex gap-4 pt-4">
                      <button type="submit" className="flex-grow py-4 bg-nordic-ink text-white font-bold rounded-2xl hover:shadow-xl transition-all">
                         {editingVehicleId ? 'Update Vehicle' : 'Register Vehicle'}
                      </button>
                      <button type="button" onClick={resetVehicleForm} className="px-8 py-4 bg-nordic-snow text-nordic-ink/60 font-bold rounded-2xl hover:bg-nordic-slate/5 transition-all">
                         Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-nordic-slate/10 space-y-4">
                  <div className="w-16 h-16 bg-nordic-snow rounded-2xl flex items-center justify-center mx-auto text-nordic-ink/20">
                    <Car size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif">Empty Garage</h3>
                    <p className="text-sm opacity-40">You haven't added any vehicles yet.</p>
                  </div>
                  <button onClick={() => setIsAddingVehicle(true)} className="text-nordic-blue font-bold underline underline-offset-4">Add your first vehicle</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.map(v => (
                    <div key={v.id} className="bg-white rounded-3xl border border-nordic-slate/10 p-8 space-y-6 group hover:border-nordic-blue/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-serif">{v.make} {v.model}</h3>
                          <div className="flex items-center gap-2 text-xs opacity-40 font-bold uppercase tracking-widest">
                            <span>{v.year}</span>
                            <span>•</span>
                            <span className="text-nordic-ink">{v.licensePlate}</span>
                            {v.isJapaneseImport && (
                              <>
                                <span>•</span>
                                <span className="text-nordic-blue flex items-center gap-1"><Globe size={12} /> JDM</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleEditVehicle(v)} className="p-3 bg-nordic-snow rounded-xl text-nordic-ink/40 hover:text-nordic-blue transition-colors">
                              <Edit2 size={16} />
                           </button>
                           <button onClick={() => handleDeleteVehicle(v.id)} className="p-3 bg-nordic-snow rounded-xl text-nordic-ink/40 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                      </div>

                      {v.vin && (
                        <div className="p-3 bg-nordic-snow rounded-xl font-mono text-[10px] text-nordic-ink/60 border border-nordic-slate/5">
                           VIN: {v.vin}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Maintenance History</h4>
                          <button onClick={() => addMaintenanceEntry(v.id)} className="text-[10px] font-bold text-nordic-blue hover:underline">Add Record</button>
                        </div>
                        <div className="space-y-2">
                          {v.maintenanceHistory && v.maintenanceHistory.length > 0 ? (
                            v.maintenanceHistory.slice(-3).reverse().map(entry => (
                              <div key={entry.id} className="flex items-center justify-between p-4 bg-nordic-snow rounded-2xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-nordic-blue">
                                    <Wrench size={14} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold">{entry.service}</p>
                                    <p className="text-[10px] opacity-40">User Added Record</p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono opacity-40">---</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs italic opacity-30 text-center py-4">No records yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8">
              <header className="space-y-2">
                <h1 className="text-5xl font-serif tracking-tight">Maintenance History</h1>
                <p className="text-nordic-ink/60 font-light">A digital logbook for your car's lifetime. Increases resale value.</p>
              </header>

              <div className="bg-white rounded-3xl border border-nordic-slate/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-nordic-snow/50 border-b border-nordic-slate/10">
                     <tr>
                       <th className="p-6 font-bold uppercase tracking-widest text-[10px] opacity-40">Service date</th>
                       <th className="p-6 font-bold uppercase tracking-widest text-[10px] opacity-40">Vehicle</th>
                       <th className="p-6 font-bold uppercase tracking-widest text-[10px] opacity-40">Status</th>
                       <th className="p-6 font-bold uppercase tracking-widest text-[10px] opacity-40 text-right">Price</th>
                     </tr>
                   </thead>
                   <tbody>
                     {appointments.map(appt => (
                       <tr key={appt.id} className="border-b border-nordic-slate/5 hover:bg-nordic-snow/30 transition-colors cursor-pointer group">
                         <td className="p-6 font-medium">{format(new Date(appt.scheduledAt.seconds * 1000), 'MMM do, yyyy')}</td>
                         <td className="p-6">
                           <div className="flex items-center gap-2">
                             <Car size={16} className="text-nordic-blue" />
                             <span>{appt.vehicle?.make} {appt.vehicle?.model}</span>
                           </div>
                         </td>
                         <td className="p-6">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${appt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-nordic-slate/10 text-nordic-ink/40'}`}>
                              {appt.status}
                            </span>
                         </td>
                         <td className="p-6 text-right font-mono font-bold">${appt.totalPrice.toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <header className="space-y-2">
                <h1 className="text-5xl font-serif tracking-tight">App Settings</h1>
                <p className="text-nordic-ink/60 font-light">Customize your FutureMotors experience.</p>
              </header>

              <div className="bg-white rounded-3xl border border-nordic-slate/10 p-10 space-y-12">
                <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Notifications & Engagement</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-nordic-snow rounded-2xl">
                      <div className="space-y-1">
                        <p className="font-bold">Service Reminders</p>
                        <p className="text-xs opacity-60">Get notified when it's time for seasonal tyre changes or oil service.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-nordic-slate/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nordic-blue"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-nordic-snow rounded-2xl">
                      <div className="space-y-1">
                        <p className="font-bold">Marketing Promotions</p>
                        <p className="text-xs opacity-60">Receive exclusive Nordic car care offers and early access to marketplace deals.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-nordic-slate/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nordic-blue"></div>
                      </label>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Nordic Preference</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="p-6 rounded-2xl border-2 border-nordic-ink bg-white flex flex-col items-center gap-3">
                        <div className="w-8 h-8 bg-nordic-snow rounded-full border border-nordic-slate/10" />
                        <span className="text-xs font-bold">Snow (Default)</span>
                     </button>
                     <button className="p-6 rounded-2xl border-2 border-transparent bg-nordic-ink text-white flex flex-col items-center gap-3 hover:border-nordic-slate/20 transition-all">
                        <div className="w-8 h-8 bg-nordic-ink rounded-full border border-white/20" />
                        <span className="text-xs font-bold">Midnight</span>
                     </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default MyAccount;
