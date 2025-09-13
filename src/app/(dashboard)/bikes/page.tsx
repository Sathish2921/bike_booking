
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  Mountain, 
  MapPin, 
  Zap, 
  Bike, 
  ChevronDown, 
  ChevronUp,
  Search,
  Star,
  Heart,
  Users,
  Fuel,
  Settings,
  ShoppingCart
} from "lucide-react";
import BookingModal from "@/components/bikes/bike-model"; 
import { getFromLocalStorage, saveToLocalStorage } from "@/components/ui/encryption";
import { useRouter } from "next/navigation";
// Types
interface BikeEngine {
  cc: number;
  type: string;
  power_bhp: string;
  torque_nm: string;
}

interface BikeInventory {
  total: number;
  by_color: { [key: string]: number };
}

interface BikeInsurance {
  included: boolean;
  type: string;
  coverage: string;
}

interface BikeData {
  _id: string;
  brand: string;
  model: string;
  category: string;
  type: string;
  availability: boolean;
  price_per_day_INR: number;
  colors: string[];
  inventory: BikeInventory;
  imageUrl: string;
  color_image_urls: { [key: string]: string };
  transmission: string;
  engine: BikeEngine;
  fuel_type: string;
  mileage_kmpl: number;
  top_speed_kmph: number;
  seat_height_mm: number;
  weight_kg: number;
  features: string[];
  documents_required: string[];
  insurance: BikeInsurance;
  rating: number;
  reviews_count: number;
  location_available: string[];
}

interface BikeTypeData {
  id: string;
  biketype: string;
  data: BikeData[];
}

interface SearchData {
  city: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
}

interface Filters {
  priceRange: [number, number];
  selectedTypes: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  availability: string;
  favorites: boolean;
}

interface CartItem {
  bike: BikeData;
  quantity: number;
  selectedColor: string;
}

// Sample data from your original code
const bikesData: BikeTypeData[] = [
    {
        "id": "101",
        "biketype": "commuter",
        "data": [ 
            {
                "_id": "650a1fb9f1d2c45678abc101",
                "brand": "Honda",
                "model": "SP 125",
                "category": "motorcycle",
                "type": "commuter",
                "availability": false,
                "price_per_day_INR": 500,
                "colors": ["Black", "Blue", "Grey"],
                "inventory": {
                "total": 2,
                "by_color": {
                    "Black": 1,
                    "Blue": 1,
                    "Grey": 0
                }
                },
                "imageUrl": "/bikeImg/commuter/Honda-SP-125.webp",
                "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.jpg",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                },
                "transmission": "manual",
                "engine": {
                "cc": 124,
                "type": "Single-cylinder, air-cooled",
                "power_bhp": "10.8",
                "torque_nm": "10.9 Nm @ 6000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 65,
                "top_speed_kmph": 100,
                "seat_height_mm": 790,
                "weight_kg": 117,
                "features": [
                "Digital meter",
                "LED headlamp",
                "eSP Technology",
                "Silent start",
                "Tubeless tires"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Comprehensive",
                "coverage": "Covers accidental and third-party damage"
                },
                "rating": 4.4,
                "reviews_count": 98,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            },
            {
                "_id": "650a1fb9f1d2c45678abc102",
                "brand": "Hero",
                "model": "Splendor Plus",
                "category": "motorcycle",
                "type": "commuter",
                "availability": true,
                "price_per_day_INR": 450,
                "colors": ["Black with Silver", "Red", "Blue"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "Black with Silver": 0,
                    "Red": 0,
                    "Blue": 1
                }
                },
                "imageUrl": "/bikeImg/commuter/hero_splendor_plus.jpg",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 97,
                "type": "Air-cooled, 4-stroke",
                "power_bhp": "7.9",
                "torque_nm": "8.05 Nm @ 6000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 70,
                "top_speed_kmph": 87,
                "seat_height_mm": 785,
                "weight_kg": 110,
                "features": [
                "i3s Technology",
                "Kick and electric start",
                "Tubeless tyres",
                "Alloy wheels",
                "USB charger"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Third-party",
                "coverage": "Basic accident and liability coverage"
                },
                "rating": 4.3,
                "reviews_count": 76,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            }
        ]
    },
    {
        "id": "102",
        "biketype": "sports",
        "data":[
            {
                "_id": "650a1fb9f1d2c45678abc201",
                "brand": "Yamaha",
                "model": "R15 V4",
                "category": "motorcycle",
                "type": "sport",
                "availability": true,
                "price_per_day_INR": 1200,
                "colors": ["Racing Blue", "Metallic Grey"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "Racing Blue": 0,
                    "Metallic Grey": 1
                }
                },
                "imageUrl": "/bikeImg/sport/yamaha_r15_v4.webp",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 155,
                "type": "Liquid-cooled, 4-stroke",
                "power_bhp": "18.1",
                "torque_nm": "14.2 Nm @ 7500 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 40,
                "top_speed_kmph": 140,
                "seat_height_mm": 815,
                "weight_kg": 142,
                "features": [
                "Variable Valve Actuation",
                "LED lighting",
                "Dual-channel ABS",
                "Digital instrument cluster"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Comprehensive",
                "coverage": "Full damage and third-party coverage"
                },
                "rating": 4.6,
                "reviews_count": 201,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            },
            {
                "_id": "650a1fb9f1d2c45678abc202",
                "brand": "KTM",
                "model": "RC 200",
                "category": "motorcycle",
                "type": "sport",
                "availability": true,
                "price_per_day_INR": 1400,
                "colors": ["White", "Orange"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "White": 0,
                    "Orange": 1
                }
                },
                "imageUrl": "/bikeImg/sport/KTM_RC_200.jpg",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 199.5,
                "type": "Liquid-cooled, DOHC",
                "power_bhp": "25",
                "torque_nm": "19.2 Nm @ 8000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 35,
                "top_speed_kmph": 140,
                "seat_height_mm": 835,
                "weight_kg": 160,
                "features": [
                "Split LED headlamp",
                "LCD dashboard",
                "ABS",
                "Trellis frame"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Comprehensive",
                "coverage": "Full body and engine protection"
                },
                "rating": 4.5,
                "reviews_count": 162,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            }
        ]
    },
    {
        "id": "103",
        "biketype": "cruiser",
        "data": [
            {
                "_id": "650a1fb9f1d2c45678abc301",
                "brand": "Royal Enfield",
                "model": "Meteor 350",
                "category": "motorcycle",
                "type": "cruiser",
                "availability": true,
                "price_per_day_INR": 1600,
                "colors": ["Fireball Red", "Supernova Brown"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "Fireball Red": 0,
                    "Supernova Brown": 1
                }
                },
                "imageUrl": "/bikeImg/cruiser/royal_enfield_meteor_350.webp",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 349,
                "type": "Air-oil cooled, SOHC",
                "power_bhp": "20.2",
                "torque_nm": "27 Nm @ 4000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 35,
                "top_speed_kmph": 120,
                "seat_height_mm": 765,
                "weight_kg": 191,
                "features": [
                "Tripper Navigation",
                "Comfortable seating",
                "USB charging port",
                "ABS"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Third-party",
                "coverage": "Liability and minor damage coverage"
                },
                "rating": 4.6,
                "reviews_count": 134,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            },
            {
                "_id": "650a1fb9f1d2c45678abc302",
                "brand": "Bajaj",
                "model": "Avenger Cruise 220",
                "category": "motorcycle",
                "type": "cruiser",
                "availability": true,
                "price_per_day_INR": 1500,
                "colors": ["Moon White", "Auburn Black"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "Moon White": 1,
                    "Auburn Black": 0
                }
                },
                "imageUrl": "/bikeImg/cruiser/bajaj_avenger.avif",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 220,
                "type": "Twin spark, oil-cooled",
                "power_bhp": "19",
                "torque_nm": "17.5 Nm @ 7000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 40,
                "top_speed_kmph": 115,
                "seat_height_mm": 737,
                "weight_kg": 163,
                "features": [
                "Low seat height",
                "Long wheelbase",
                "Cruiser handlebar",
                "Windshield"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Third-party",
                "coverage": "Basic damage and liability"
                },
                "rating": 4.4,
                "reviews_count": 97,
                "location_available": ["Coimbatore", "Ghandipuram", "Coimbatore Railway Station"]
            }
        ]
    },
    {
        "id": "104",
        "biketype": "adventure",
        "data": [
            {
                "_id": "650a1fb9f1d2c45678abc401",
                "brand": "KTM",
                "model": "390 Adventure",
                "category": "motorcycle",
                "type": "adventure",
                "availability": true,
                "price_per_day_INR": 2000,
                "colors": ["Orange", "White"],
                "inventory": {
                "total": 1,
                "by_color": {
                    "Orange": 1,
                    "White": 0
                }
                },
                "imageUrl": "/bikeImg/adventure/ktm_390_adventure.avif",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                "cc": 373,
                "type": "Liquid-cooled, single-cylinder",
                "power_bhp": "43",
                "torque_nm": "37 Nm @ 7000 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 28,
                "top_speed_kmph": 170,
                "seat_height_mm": 855,
                "weight_kg": 177,
                "features": [
                "TFT display",
                "Cornering ABS",
                "Traction Control",
                "Ride-by-wire"
                ],
                "documents_required": [
                "Valid Driving License",
                "Government-issued ID Proof"
                ],
                "insurance": {
                "included": true,
                "type": "Comprehensive",
                "coverage": "Full damage and off-road cover"
                },
                "rating": 4.8,
                "reviews_count": 142,
                "location_available": ["Coimbatore","Ghandipuram", "Coimbatore Railway Station"]
            },
            {
                "_id": "650a1fb9f1d2c45678abc003",
                "brand": "BMW",
                "model": "G 310 GS",
                "category": "motorcycle",
                "type": "adventure",
                "availability": true,
                "price_per_day_INR": 2500,
                "colors": ["Racing Red", "Polar White", "Cosmic Black"],
                "inventory": {
                    "total": 1,
                    "by_color": {
                    "Racing Red": 0,
                    "Polar White": 1,
                    "Cosmic Black": 0
                    }
                },
                "imageUrl": "/bikeImg/adventure/bmw.jpg",
                 "color_image_urls": {
                  "Black": "/bikeImg/commuter/Honda-SP-125-Black.webp",
                  "Blue": "/bikeImg/commuter/Honda-SP-125-Blue.webp",
                  "Grey": "/bikeImg/commuter/Honda-SP-125-Grey.webp"
                },
                "transmission": "manual",
                "engine": {
                    "cc": 313,
                    "type": "Single-cylinder, liquid-cooled, 4-stroke",
                    "power_bhp": "33.5",
                    "torque_nm": "28 Nm @ 7500 rpm"
                },
                "fuel_type": "petrol",
                "mileage_kmpl": 30,
                "top_speed_kmph": 143,
                "seat_height_mm": 835,
                "weight_kg": 169.5,
                "features": [
                    "Upside-down front forks",
                    "Dual-channel ABS",
                    "LED Headlight",
                    "Adjustable brake and clutch levers",
                    "Multifunction LCD display"
                ],
                "documents_required": [
                    "Valid Driving License",
                    "Government-issued ID Proof"
                ],
                "insurance": {
                    "included": true,
                    "type": "Comprehensive",
                    "coverage": "Covers damage, theft, and third-party liability"
                },
                "rating": 4.6,
                "reviews_count": 87,
                "location_available": ["Coimbatore","Ghandipuram", "Coimbatore Railway Station"]
            }
        ]
    }
];

const BikeListingPage: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    city: 'Coimbatore',
    pickupDate: '2025-07-28',
    pickupTime: '09:00',
    dropoffDate: '2025-07-29',
    dropoffTime: '18:00'
  });
  
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState<boolean>(true);

  const [likedBikes, setLikedBikes] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBike, setSelectedBike] = useState<BikeData | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  
const router = useRouter();
  
  const [filters, setFilters] = useState<Filters>({
    priceRange: [500, 3500],
    selectedTypes: [],
    selectedCategories: [],
    selectedBrands: [],
    availability: "all",
    favorites: false,
  });

  // Flatten bikes data for easier processing
  const allBikes: BikeData[] = useMemo(() => {
    return bikesData.flatMap(bikeType => bikeType.data);
  }, []);

  // Get unique values for filters
  const uniqueTypes = [...new Set(allBikes.map((bike) => bike.type))];
  const uniqueCategories = [...new Set(allBikes.map((bike) => bike.category))];
  const uniqueBrands = [...new Set(allBikes.map((bike) => bike.brand))];

  // Filter bikes based on selected filters
  const filteredBikes = useMemo(() => {
    return allBikes.filter((bike) => {
      const priceCheck =
        bike.price_per_day_INR >= filters.priceRange[0] &&
        bike.price_per_day_INR <= filters.priceRange[1];
      const typeCheck =
        filters.selectedTypes.length === 0 ||
        filters.selectedTypes.includes(bike.type);
      const categoryCheck =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(bike.category);
      const brandCheck =
        filters.selectedBrands.length === 0 ||
        filters.selectedBrands.includes(bike.brand);
      const availabilityCheck =
        filters.availability === "all" ||
        (filters.availability === "available" && bike.availability) ||
        (filters.availability === "booked" && !bike.availability);
      const favoritesCheck = !filters.favorites || likedBikes.includes(bike._id);  

      return priceCheck && typeCheck && categoryCheck && brandCheck && availabilityCheck && favoritesCheck;
    });
  }, [allBikes, filters, likedBikes]);
  
  const getTypeIcon = (type: string): React.JSX.Element => {
    switch (type) {
      case "adventure":
        return <Mountain className="w-4 h-4" />;
      case "commuter":
        return <MapPin className="w-4 h-4" />;
      case "sport":
        return <Zap className="w-4 h-4" />;
      case "cruiser":
        return <Bike className="w-4 h-4" />;
      default:
        return <Bike className="w-4 h-4" />;
    }
  };

  const clearAllFilters = (): void => {
    setFilters({
      priceRange: [500, 3500],
      selectedTypes: [],
      selectedCategories: [],
      selectedBrands: [],
      availability: "all",
      favorites: false,
    });
    
  };

  const toggleArrayFilter = (value: string, filterKey: keyof Pick<Filters, 'selectedTypes' | 'selectedCategories' | 'selectedBrands'>): void => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter(item => item !== value)
        : [...prev[filterKey], value]
    }));
  };

  const openBookingModal = (bike: BikeData): void => {
    setSelectedBike(bike);
    setShowBookingModal(true);
  };

  const closeBookingModal = (): void => {
    setShowBookingModal(false);
    setSelectedBike(null);
  };

  const addToCart = (bike: BikeData, days: number, selectedColor: string): void => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.bike._id === bike._id && item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.bike._id === bike._id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { bike, quantity: 1, selectedColor }];
      }
    });
  };

  const handleBookNow = (bike: BikeData, days: number, selectedColor: string): void => {
    // Handle booking logic here
    console.log('Booking:', { bike, days, selectedColor });
  };

  const getCartItemCount = (bikeId: string): number => {
    return cart.reduce((total, item) => 
      item.bike._id === bikeId ? total + item.quantity : total, 0
    );
  };

  const getTotalCartItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const BikeCard: React.FC<{ bike: BikeData; index: number }> = ({ bike, index  }) => {
    const cartCount = getCartItemCount(bike._id);
    const [liked, setLiked] = useState<boolean>(false);
    // const isLiked = likedBikes.includes(bike._id);

  // Load liked state from localStorage on mount
  const safeParse = <T,>(value: string | null, fallback: T): T => {
    try {
        if (!value) return fallback;
        return JSON.parse(value);
    } catch {
        return fallback;
    }
  };
  useEffect(() => {
    const storedLikes = safeParse<string[]>(getFromLocalStorage("likedBikes"), []);
    setLiked(storedLikes.includes(bike._id));
    console.log("Running")
  }, [bike._id]);

  // Toggle like state and update localStorage
  const toggleLike = () => {
    const storedLikes = safeParse(getFromLocalStorage("likedBikes"), []);
    let updatedLikes;

    if (liked) {
      updatedLikes = storedLikes.filter(id => id !== bike._id);
    } else {
      updatedLikes = [...storedLikes, bike._id];
    }

    saveToLocalStorage("likedBikes", JSON.stringify(updatedLikes));
    setLiked(!liked);
    setLikedBikes(updatedLikes); // sync global state
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img 
            src={bike.imageUrl} 
            alt={`${bike.brand} ${bike.model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
             <Heart
              className={`w-5 h-5 transition-colors ${
                liked  ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              {bike.engine.cc}cc
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="md:h-24 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900">
                {bike.brand} {bike.model}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{bike.rating}</span>
                <span className="text-sm text-gray-500">({bike.reviews_count})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2 seats</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="w-4 h-4" />
                <span>{bike.mileage_kmpl} kmpl</span>
              </div>
              <div className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                <span>{bike.transmission}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#AC9456]">₹{bike.price_per_day_INR}</span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
            <div className="flex gap-2">
              {cartCount > 0 && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">{cartCount}</span>
                </div>
              )}
              <button 
                // onClick={() => openBookingModal(bike)}
                onClick={() => (router.push(`/bikeDetail?id=${bike._id}`))}
                className="bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FilterPanel: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
    <div className={`bg-white ${isMobile ? 'p-4' : 'p-6'} rounded-lg shadow-md`}>
      <div className=" flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {isMobile && (
          <button onClick={() => setShowMobileFilters(false)}>
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

       {/* Favorites Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.favorites}
            onChange={(e) => setFilters(prev => ({ ...prev, favorites: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Show Favorites Only</span>
          </div>
        </label>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Price Range (per day)</label>
        <div className="px-2">
          <input
            type="range"
            min="500"
            max="3500"
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Bike Types */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Bike Type</label>
        <div className="space-y-2">
          {uniqueTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedTypes.includes(type)}
                onChange={() => toggleArrayFilter(type, 'selectedTypes')}
                className="rounded border-gray-300"
              />
              <div className="flex items-center gap-2">
                {getTypeIcon(type)}
                <span className="capitalize text-sm">{type}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Category</label>
        <div className="space-y-2">
          {uniqueCategories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedCategories.includes(category)}
                onChange={() => toggleArrayFilter(category, 'selectedCategories')}
                className="rounded border-gray-300"
              />
              <span className="capitalize text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Brand</label>
        <div className="space-y-2">
          {uniqueBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedBrands.includes(brand)}
                onChange={() => toggleArrayFilter(brand, 'selectedBrands')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Availability</label>
        <select
          value={filters.availability}
          onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {clearAllFilters(); setShowMobileFilters(false);}}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Premium Bikes</h1>
              {/* Cart Icon */}
              {/* <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#AC9456] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
              </div> */}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchData.city}
                onChange={(e) => setSearchData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="bg-transparent border-none outline-none flex-1 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={searchData.pickupDate}
                onChange={(e) => setSearchData(prev => ({ ...prev, pickupDate: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
              <input
                type="time"
                value={searchData.pickupTime}
                onChange={(e) => setSearchData(prev => ({ ...prev, pickupTime: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={searchData.dropoffDate}
                onChange={(e) => setSearchData(prev => ({ ...prev, dropoffDate: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
              <input
                type="time"
                value={searchData.dropoffTime}
                onChange={(e) => setSearchData(prev => ({ ...prev, dropoffTime: e.target.value }))}
                className="bg-transparent border-none outline-none"
              />
            </div>
            
            <button className=" bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white px-6 py-2 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden">
            <div 
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{searchData.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {new Date(searchData.pickupDate).toLocaleDateString()} - {new Date(searchData.dropoffDate).toLocaleDateString()}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showMobileSearch ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {showMobileSearch && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <div className="flex items-center gap-2 border rounded-lg p-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={searchData.city}
                      onChange={(e) => setSearchData(prev => ({ ...prev, city: e.target.value }))}
                      className="flex-1 border-none outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pick Up</label>
                    <input
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) => setSearchData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      className="w-full border rounded-lg p-2"
                    />
                    <input
                      type="time"
                      value={searchData.pickupTime}
                      onChange={(e) => setSearchData(prev => ({ ...prev, pickupTime: e.target.value }))}
                      className="w-full border rounded-lg p-2 mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Drop Off</label>
                    <input
                      type="date"
                      value={searchData.dropoffDate}
                      onChange={(e) => setSearchData(prev => ({ ...prev, dropoffDate: e.target.value }))}
                      className="w-full border rounded-lg p-2"
                    />
                    <input
                      type="time"
                      value={searchData.dropoffTime}
                      onChange={(e) => setSearchData(prev => ({ ...prev, dropoffTime: e.target.value }))}
                      className="w-full border rounded-lg p-2 mt-2"
                    />
                  </div>
                </div>
                
                <button 
                  className="w-full  bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white py-3 rounded-lg font-medium transition-colors"
                  onClick={() => setShowMobileSearch(false)}
                >
                  Search Bikes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className={`hidden lg:block w-80 transition-all duration-300 ${showDesktopFilters ? 'opacity-100' : 'opacity-0 w-0'}`}>
            {showDesktopFilters && <FilterPanel />}
          </div>

          {/* Bikes Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{filteredBikes.length} bikes available</p>
              <button
                onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-5 h-5" />
                {showDesktopFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBikes.map((bike, index) => (
                <BikeCard key={bike._id} bike={bike} index={index}  />
              ))}
            </div>

            {filteredBikes.length === 0 && (
              <div className="text-center py-12">
                <Bike className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bikes found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearAllFilters}
                  className=" bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowMobileFilters(true)}
          className=" bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
            <FilterPanel isMobile={true} />
          </div>
        </div>
      )}
       {/* Booking Modal */}
       {console.log("selected",selectedBike)}
          <BookingModal
        bike={selectedBike}
        isOpen={showBookingModal}
        onClose={closeBookingModal}
        // onAddToCart={addToCart}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default BikeListingPage;
