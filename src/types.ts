export type UserRole = 'customer' | 'admin' | 'staff';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: any;
}

export interface MaintenanceEntry {
  id: string;
  date: any;
  service: string;
  mileage?: number;
  notes?: string;
  cost?: number;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  isJapaneseImport?: boolean;
  maintenanceHistory?: MaintenanceEntry[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerId: string;
  staffId?: string;
  serviceIds: string[];
  vehicleId?: string;
  vehicle?: {
    make: string;
    model: string;
    year: string | number;
    plate: string;
    isJapaneseImport?: boolean;
  };
  status: AppointmentStatus;
  scheduledAt: any;
  location: {
    address: string;
    city: string;
  };
  totalPrice: number;
  notes?: string;
  createdAt: any;
}

export interface CarService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cleaning' | 'protection' | 'maintenance' | 'pimping' | 'repair';
  duration: number;
  icon?: string;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  type: 'car' | 'accessory';
  images: string[];
  status: 'active' | 'sold' | 'archived';
  isJapaneseImport?: boolean;
  vin?: string;
  createdAt: any;
  specs?: Record<string, string>;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface Chat {
  id: string;
  participantIds: string[];
  listingId?: string;
  lastMessage?: string;
  updatedAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}
