import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, Zap, Info, Camera, MapPin } from 'lucide-react';
import { SERVICES, APP_NAME } from '../constants';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-nordic-ink text-nordic-snow">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c3d9?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-nordic-ink via-nordic-ink/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <p className="uppercase tracking-[0.3em] text-xs font-bold text-nordic-blue">Est. 2026 | Stockholm</p>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter">
                Premium Car Care <br />
                <span className="italic opacity-80 text-nordic-frost">At Your Doorstep.</span>
              </h1>
            </div>
            <p className="text-lg text-nordic-snow/70 max-w-md font-light leading-relaxed">
              We bring specialized workshop services directly to your home. Cleaning, tyre changes, and professional polishing while you relax.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/book')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-nordic-snow text-nordic-ink rounded-full font-bold transition-all hover:bg-nordic-frost active:scale-95"
              >
                Book Service
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={() => navigate('/marketplace')}
                className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          </motion.div>

          <div className="hidden md:grid grid-cols-2 gap-4">
             {[
               { icon: MapPin, title: "Mobile Workshop", text: "We come to you." },
               { icon: Shield, title: "Verified Service", text: "Pro results guaranteed." },
               { icon: Star, title: "Nordic Quality", text: "Premium materials." },
               { icon: Zap, title: "Swift Booking", text: "Simple & Fast." },
             ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl space-y-3"
                >
                  <feature.icon className="text-nordic-frost" size={24} />
                  <h3 className="font-serif text-xl">{feature.title}</h3>
                  <p className="text-xs opacity-60 font-light">{feature.text}</p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif tracking-tight">Our Specialized Services</h2>
            <p className="text-nordic-ink/60 max-w-md">Every detail matters. We use the finest Nordic methods to preserve and enhance your vehicle.</p>
          </div>
          <button className="text-nordic-blue font-bold flex items-center gap-2 hover:gap-3 transition-all underline decoration-nordic-blue/30 underline-offset-8">
            View All Services <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="nordic-card p-8 group cursor-pointer"
              onClick={() => navigate('/book')}
            >
              <div className="w-12 h-12 bg-nordic-snow rounded-xl flex items-center justify-center mb-6 text-nordic-blue group-hover:bg-nordic-ink group-hover:text-nordic-snow transition-colors">
                 <Shield size={24} />
              </div>
              <h3 className="text-2xl font-serif mb-2">{service.name}</h3>
              <p className="text-sm text-nordic-ink/60 mb-6 font-light line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-nordic-slate/5">
                <span className="text-xl font-mono tracking-tighter">from ${service.price}</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity">Details →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Marketplace Teaser */}
      <section className="py-24 bg-nordic-snow border-y border-nordic-slate/10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1617469767053-d3b508a0d822?q=80&w=1200&auto=format&fit=crop" 
              alt="Car Marketplace" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-nordic-ink/10 group hover:bg-transparent transition-all duration-500" />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-serif">Nordic Auto Marketplace</h2>
              <p className="text-lg text-nordic-ink/70 font-light leading-relaxed">
                Looking to sell? We can come to you, inspect your vehicle, take professional grade photos, and list it on our exclusive marketplace. 
                The most secure way to buy and sell premium cars and accessories.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                { icon: Camera, text: "Professional on-site photography" },
                { icon: Shield, text: "Verified maintenance history integration" },
                { icon: Info, text: "Accurate valuations based on condition" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-nordic-ink/80">
                  <div className="w-6 h-6 rounded-full bg-nordic-blue/10 flex items-center justify-center text-nordic-blue">
                    <item.icon size={14} />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/marketplace')}
              className="px-10 py-4 bg-nordic-ink text-nordic-snow rounded-full font-bold hover:bg-nordic-slate transition-all shadow-lg shadow-nordic-ink/10"
            >
              Enter Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-nordic-blue/20 flex justify-center">
            <Star size={64} fill="currentColor" />
          </div>
          <blockquote className="text-4xl md:text-5xl font-serif italic text-nordic-ink/80 leading-snug">
            "We believe car maintenance shouldn't disrupt your life. We combine traditional workshop excellence with modern mobile convenience."
          </blockquote>
          <div>
            <p className="font-bold tracking-widest uppercase text-xs">Erik Forsberg</p>
            <p className="text-xs text-nordic-ink/40">Founder, FutureMotors</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
