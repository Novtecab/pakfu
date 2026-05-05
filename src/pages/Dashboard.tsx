import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, AlertTriangle, Package, Search, Filter, MoreHorizontal, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Appointment, InventoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Dashboard = () => {
  const { isStaff } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) return;
    
    const apptsQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubAppts = onSnapshot(apptsQuery, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
    });

    const invQuery = collection(db, 'inventory');
    const unsubInv = onSnapshot(invQuery, (snapshot) => {
      setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InventoryItem[]);
      setLoading(false);
    });

    return () => {
      unsubAppts();
      unsubInv();
    };
  }, [isStaff]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      toast.success(`Updated status to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (!isStaff) {
    return (
      <div className="h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <AlertTriangle size={64} className="mx-auto text-red-500" />
          <h2 className="text-3xl font-serif text-nordic-ink">Restricted Access</h2>
          <p className="text-nordic-ink/60 font-light">This portal is reserved for FutureMotors staff and administrators.</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalRevenue = appointments.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const activeBookings = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  
  // Dummy chart data derived from actual appointments could go here, but let's provide a realistic trend
  const chartData = [
    { name: 'Mon', revenue: 450 },
    { name: 'Tue', revenue: 780 },
    { name: 'Wed', revenue: 1200 },
    { name: 'Thu', revenue: 900 },
    { name: 'Fri', revenue: 1540 },
    { name: 'Sat', revenue: 2100 },
    { name: 'Sun', revenue: 1800 },
  ];

  return (
    <div className="min-h-screen bg-nordic-snow py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-nordic-slate/10 pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif tracking-tighter">Business Insights</h1>
            <p className="text-nordic-ink/60 max-w-xl font-light">Real-time overview of FutureMotors operations and customer engagement.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-3 bg-white border border-nordic-slate/10 rounded-xl text-sm font-bold hover:bg-nordic-slate/5 transition-all">Export CSV</button>
             <button className="px-6 py-3 bg-nordic-ink text-nordic-snow rounded-xl text-sm font-bold hover:bg-nordic-slate transition-all shadow-lg shadow-nordic-ink/10">Manage Schedule</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, label: "Total Revenue", val: `$${totalRevenue.toLocaleString()}`, trend: "+12%", color: "text-green-600" },
            { icon: Calendar, label: "Active Bookings", val: activeBookings, trend: "+5", color: "text-nordic-blue" },
            { icon: Users, label: "New Customers", val: "128", trend: "+3.2%", color: "text-purple-600" },
            { icon: TrendingUp, label: "Avg. Ticket", val: "$245", trend: "+1.5%", color: "text-orange-600" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-nordic-slate/10 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 bg-nordic-snow rounded-xl ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">{stat.trend}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">{stat.label}</p>
                <p className="text-3xl font-serif mt-1">{stat.val}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Revenue Chart */}
           <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-nordic-slate/10 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="font-serif text-2xl">Revenue Trend</h3>
                 <select className="text-xs font-bold bg-nordic-snow border-none rounded-lg px-3 py-1 outline-none">
                   <option>Last 7 Days</option>
                   <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5E81AC" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#5E81AC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, opacity: 0.4 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, opacity: 0.4 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#5E81AC', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#5E81AC" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Inventory Alert */}
           <div className="bg-white p-10 rounded-3xl border border-nordic-slate/10 shadow-sm space-y-8 flex flex-col">
              <div className="flex justify-between items-center">
                 <h3 className="font-serif text-2xl">Inventory</h3>
                 <Package className="text-nordic-blue opacity-20" size={24} />
              </div>
              <div className="space-y-4 flex-grow">
                 {inventory.length === 0 ? (
                   <p className="text-xs text-nordic-ink/40 text-center italic py-20">No items tracked yet.</p>
                 ) : (
                   inventory.slice(0, 5).map(item => (
                     <div key={item.id} className="flex items-center justify-between p-4 bg-nordic-snow rounded-2xl">
                        <div className="space-y-0.5">
                           <p className="font-bold text-sm tracking-tight">{item.name}</p>
                           <p className="text-[10px] opacity-40 font-mono italic">{item.sku}</p>
                        </div>
                        <div className="text-right">
                           <p className={`text-xs font-bold ${item.quantity < 5 ? 'text-red-500' : 'text-nordic-blue'}`}>
                             {item.quantity} in stock
                           </p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
              <button className="w-full py-4 bg-nordic-snow rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-nordic-slate/5 transition-all">Manage Stock</button>
           </div>

           {/* Appointments Management */}
           <div className="lg:col-span-3 bg-white rounded-3xl border border-nordic-slate/10 shadow-sm overflow-hidden mt-8">
             <div className="p-10 border-b border-nordic-slate/5 flex justify-between items-center">
                <h3 className="font-serif text-2xl">Operation Queue</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nordic-ink/20" size={14} />
                    <input type="text" placeholder="Filter jobs..." className="pl-9 pr-4 py-2 bg-nordic-snow rounded-xl text-xs outline-none focus:ring-1 ring-nordic-ink/10" />
                  </div>
                </div>
             </div>
             <table className="w-full text-left text-sm">
                <thead className="bg-nordic-snow/50 text-[10px] uppercase font-bold tracking-widest opacity-40">
                  <tr>
                    <th className="px-10 py-4">Customer</th>
                    <th className="px-10 py-4">Vehicle</th>
                    <th className="px-10 py-4">Service Date</th>
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nordic-slate/5">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center italic text-nordic-ink/40">No appointments logged.</td>
                    </tr>
                  ) : (
                    appointments.slice(0, 10).map(appt => (
                      <tr key={appt.id} className="hover:bg-nordic-snow/30 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-nordic-blue/10 flex items-center justify-center text-nordic-blue text-[10px] font-bold">
                                {appt.customerId.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-medium">User: {appt.customerId.substring(0, 6)}...</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 opacity-60">
                          {appt.vehicle?.year} {appt.vehicle?.make} {appt.vehicle?.model}
                        </td>
                        <td className="px-10 py-6 font-medium">
                           {appt.scheduledAt?.seconds ? format(new Date(appt.scheduledAt.seconds * 1000), 'MMM do, HH:mm') : 'N/A'}
                        </td>
                        <td className="px-10 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            appt.status === 'completed' ? "bg-green-50 text-green-600" : 
                            appt.status === 'pending' ? "bg-yellow-50 text-yellow-600" :
                            appt.status === 'in_progress' ? "bg-nordic-blue/10 text-nordic-blue" :
                            "bg-nordic-slate/10 text-nordic-ink/40"
                          )}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => updateStatus(appt.id, 'completed')}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button className="p-2 bg-nordic-snow text-nordic-ink rounded-lg hover:bg-nordic-ink hover:text-nordic-snow transition-all">
                                <MoreHorizontal size={14} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
