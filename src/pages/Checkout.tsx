import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { doc, getDoc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MarketplaceListing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, CreditCard, ShieldCheck, Truck, Package, CheckCircle2, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { listingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as MarketplaceListing);
        } else {
          toast.error('Listing not found');
          navigate('/marketplace');
        }
      } catch (error) {
        toast.error('Failed to load checkout details');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId, navigate]);

  const handlePayment = async () => {
    if (!user || !listing) return;
    
    setIsProcessing(true);
    try {
      // 1. Create a transaction record
      await addDoc(collection(db, 'transactions'), {
        listingId: listing.id,
        buyerId: user.uid,
        sellerId: listing.sellerId,
        amount: listing.price,
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // 2. Mark listing as sold
      await updateDoc(doc(db, 'listings', listing.id), {
        status: 'sold',
        updatedAt: serverTimestamp(),
        buyerId: user.uid
      });

      setIsSuccess(true);
      toast.success('Purchase successful!');
    } catch (error) {
      console.error(error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nordic-snow">
        <Loader2 className="w-8 h-8 animate-spin text-nordic-blue" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nordic-snow p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl space-y-6"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif">Order Confirmed</h1>
            <p className="text-nordic-ink/60 font-light">Congratulations! You are now the owner of {listing?.title}. The seller has been notified.</p>
          </div>
          <button 
            onClick={() => navigate('/my-account')}
            className="w-full py-4 bg-nordic-ink text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            Go to My Garage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nordic-snow py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
        >
          <ChevronLeft size={16} /> Back to marketplace
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-8">
            <header className="space-y-4">
              <h1 className="text-5xl font-serif tracking-tight">Checkout</h1>
              <p className="text-nordic-ink/60 font-light">Verify your order details and specify delivery preference.</p>
            </header>

            <div className="bg-white rounded-[40px] p-10 border border-nordic-slate/10 space-y-10">
              <div className="flex gap-8 border-b border-nordic-slate/10 pb-10">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-nordic-snow">
                  <img src={listing?.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-1 py-2">
                  <h2 className="text-2xl font-serif">{listing?.title}</h2>
                  <p className="text-sm opacity-40 font-bold uppercase tracking-widest">{listing?.type}</p>
                  <p className="text-xl font-mono font-bold text-nordic-blue">€{listing?.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Payment Method</h3>
                <div className="p-6 border-2 border-nordic-blue bg-nordic-blue/5 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                       <CreditCard className="text-nordic-blue" />
                    </div>
                    <div>
                      <p className="font-bold">FutureMotors Safe Pay</p>
                      <p className="text-xs opacity-50">Secure escrow payment</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-nordic-blue" size={24} />
                </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Logistics</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 bg-nordic-snow rounded-3xl border border-transparent hover:border-nordic-blue/20 text-left transition-all group">
                       <Truck className="mb-3 text-nordic-ink/40 group-hover:text-nordic-blue transition-colors" />
                       <p className="font-bold text-sm">Escorted Delivery</p>
                       <p className="text-[10px] opacity-40 font-bold">INSURED TRANSIT</p>
                    </button>
                    <button className="p-6 bg-nordic-snow rounded-3xl border border-transparent hover:border-nordic-blue/20 text-left transition-all group">
                       <Package className="mb-3 text-nordic-ink/40 group-hover:text-nordic-blue transition-colors" />
                       <p className="font-bold text-sm">Self-Collection</p>
                       <p className="text-[10px] opacity-40 font-bold">VERIFIED PICKUP</p>
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Summary Sticky */}
          <div className="space-y-6">
             <div className="bg-nordic-ink text-white rounded-[40px] p-10 space-y-8 sticky top-24">
                <h3 className="text-2xl font-serif">Order Summary</h3>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="opacity-60">Price</span>
                      <span className="font-mono font-bold">€{listing?.price.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="opacity-60">Safety Fee</span>
                      <span className="font-mono font-bold font-green-400 text-green-400">FREE</span>
                   </div>
                   <div className="flex justify-between pt-4">
                      <span className="text-lg font-serif">Total</span>
                      <span className="text-2xl font-mono font-bold">€{listing?.price.toLocaleString()}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-5 bg-nordic-blue hover:bg-nordic-blue/90 text-white rounded-2xl font-bold transition-all shadow-xl shadow-nordic-blue/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>Confirm & Pay</>
                  )}
                </button>

                <div className="space-y-4 pt-4">
                   <div className="flex items-start gap-3 text-xs opacity-50 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <ShieldCheck className="flex-shrink-0 text-nordic-blue" size={14} />
                      <p>Your payment is held securely in escrow until you take delivery and verify the vehicle.</p>
                   </div>
                   <div className="flex items-start gap-3 text-xs opacity-50 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Info className="flex-shrink-0" size={14} />
                      <p>Transactions are governed by the FutureMotors Buyer Protection policy.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
