import { CarService } from './types';

export const APP_NAME = "FutureMotors";

export const SERVICES: CarService[] = [
  {
    id: 'clean-eco',
    name: 'Eco Nordic Clean',
    description: 'Eco-friendly interior and exterior deep cleaning at your location.',
    price: 49.99,
    category: 'cleaning',
    duration: 60,
    icon: 'Sparkle'
  },
  {
    id: 'tyre-change',
    name: 'Seasonal Tyre Change',
    description: 'Quick tyre swap including balancing and inspection at home.',
    price: 89.99,
    category: 'maintenance',
    duration: 45,
    icon: 'Disc'
  },
  {
    id: 'polish-ceramic',
    name: 'Ceramic Coating & Polish',
    description: 'Premium paint protection with high-gloss finish.',
    price: 399.99,
    category: 'protection',
    duration: 240,
    icon: 'ShieldCheck'
  },
  {
    id: 'dackhotel',
    name: 'Tyre Hotel (6 months)',
    description: 'Secure storage for your seasonal tyres with cleaning included.',
    price: 120.00,
    category: 'maintenance',
    duration: 30,
    icon: 'Hotel'
  },
  {
    id: 'ppf-full',
    name: 'Paint Protection Film (Full Body)',
    description: 'Invisible shield against stone chips and scratches.',
    price: 1499.99,
    category: 'protection',
    duration: 480,
    icon: 'Layers'
  },
  {
    id: 'pick-drop',
    name: 'Valet Service (Pick & Drop)',
    description: 'We pick up your car, service it, and bring it back.',
    price: 29.99,
    category: 'maintenance',
    duration: 120,
    icon: 'MapPin'
  },
  {
    id: 'dent-paint',
    name: 'Denting & Painting',
    description: 'Professional color match and body repair.',
    price: 250.00,
    category: 'repair',
    duration: 360,
    icon: 'Palette'
  },
  {
    id: 'inspection',
    name: 'Pre-Marketplace Inspection',
    description: 'Comprehensive 50-point mobile inspection and verified status certificate for sellers.',
    price: 149.99,
    category: 'maintenance',
    duration: 90,
    icon: 'ShieldCheck'
  }
];
