import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Send, User, Car, ArrowLeft, Camera, Image, Smile, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, onSnapshot, orderBy, addDoc, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Message, MarketplaceListing } from '../types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const listingId = searchParams.get('listing');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // For demo, we use a global chat per listing or a single sandbox
    const chatId = listingId || 'global-community';
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[]);
    });

    if (listingId) {
      getDoc(doc(db, 'listings', listingId)).then(snap => {
        if (snap.exists()) setListing({ id: snap.id, ...snap.data() } as MarketplaceListing);
      });
    }

    return unsubscribe;
  }, [user, listingId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const chatId = listingId || 'global-community';
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        text: newMessage,
        createdAt: new Date(),
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-nordic-snow p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-serif">Sign in to Chat</h2>
          <p className="text-nordic-ink/60 max-w-sm mx-auto">Connect with buyers, sellers, and our mobile workshop team instantly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-nordic-snow flex flex-col">
       <header className="bg-white border-b border-nordic-slate/10 p-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-nordic-snow rounded-full transition-colors md:hidden">
              <ArrowLeft size={18} />
            </button>
            {listing ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                  <img src={listing.images[0]} alt="Car" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h2 className="font-serif text-lg leading-tight">{listing.title}</h2>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-nordic-blue">Asking: ${listing.price.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-nordic-ink rounded-xl flex items-center justify-center text-nordic-snow">
                   <User size={20} />
                </div>
                <div>
                   <h2 className="font-serif text-lg leading-tight">Nordic Support</h2>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-green-500">Service Team Online</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 hover:bg-nordic-snow rounded-full text-nordic-ink/40"><Trash2 size={18} /></button>
          </div>
       </header>

       <main className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center py-8 opacity-20 pointer-events-none">
               <div className="text-center space-y-2">
                 <Shield size={48} className="mx-auto" />
                 <p className="text-[10px] uppercase font-bold tracking-[0.2em]">End-to-end Encrypted</p>
               </div>
            </div>

            {messages.map((msg, i) => {
              const isMine = msg.senderId === user.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[75%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={(msg as any).senderPhoto || `https://ui-avatars.com/api/?name=${(msg as any).senderName}`} alt="Sender" className="w-8 h-8 rounded-full border border-white shadow-sm mt-auto" />
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-nordic-blue text-white rounded-br-none' : 'bg-white text-nordic-ink rounded-bl-none border border-nordic-slate/10'}`}>
                        {msg.text}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 ${isMine ? 'text-right' : 'text-left'}`}>
                        {msg.createdAt?.seconds ? format(new Date(msg.createdAt.seconds * 1000), 'HH:mm') : 'Just now'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={scrollRef} />
          </div>
       </main>

       <footer className="p-6 bg-white border-t border-nordic-slate/10 shadow-lg">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
             <button type="button" className="p-3 text-nordic-ink/40 hover:text-nordic-blue transition-colors">
                <Camera size={20} />
             </button>
             <button type="button" className="p-3 text-nordic-ink/40 hover:text-nordic-blue transition-colors">
                <Smile size={20} />
             </button>
             <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full px-6 py-4 bg-nordic-snow rounded-full text-sm outline-none focus:ring-2 ring-nordic-blue/10 transition-all font-medium"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
             </div>
             <button 
               type="submit"
               disabled={!newMessage.trim()}
               className="p-4 bg-nordic-ink text-nordic-snow rounded-full hover:bg-nordic-slate active:scale-90 transition-all disabled:opacity-50"
             >
                <Send size={20} />
             </button>
          </form>
       </footer>
    </div>
  );
};

export default ChatPage;
