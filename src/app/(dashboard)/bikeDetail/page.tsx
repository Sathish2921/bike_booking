

// "use client";
// import React, { useEffect, useState } from "react";
// import { X, Plus, Minus, MapPin, Calendar, Star, MapPinIcon } from "lucide-react";
// import { useCart } from "@/hooks/CartContext";
// import { useAlert } from "@/hooks/alertHook";
// import { useAppContext } from "@/hooks/context";
// import Alert from "@/components/ui/alert";

// // Updated Types based on new data structure
// interface BikeSpecifications {
//   engine: string;
//   mileage: string;
//   fuelType: string;
//   weight: string;
//   topSpeed: string;
// }

// interface BikeModelInfo {
//   brand: string;
//   model: string;
//   category: string;
//   type: string;
//   transmission: string;
//   description: string;
//   imageUrl: string;
//   specifications: BikeSpecifications;
// }

// interface VehicleMetadata {
//   holdExpiryTime?: string;
//   lastServiceDate: string;
//   nextServiceDue: string;
//   totalKms: number;
//   purchaseDate: string;
//   lastUpdated: string;
// }

// interface Vehicle {
//   vehicleId: string;
//   vehicleNumber: string;
//   status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE";
//   condition: "EXCELLENT" | "GOOD" | "FAIR";
//   location: string;
//   metadata: VehicleMetadata;
// }

// interface Pricing {
//   basePrice: number;
//   weekendMultiplier: number;
//   currency: string;
//   taxIncluded: boolean;
// }

// interface Counters {
//   total: number;
//   available: number;
//   rented: number;
//   maintenance: number;
//   inactive: number;
// }

// type BikeData = {
//   bikeId: string;
//   modelInfo: BikeModelInfo;
//   pricing: Pricing;
//   vehicles: Vehicle[];
//   counters: Counters;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type BookingModalProps = {
//   bike?: BikeData | null;
//   isOpen?: boolean;
//   onClose?: () => void;
//   onBookNow?: (bike: BikeData, days: number, selectedLocation: string) => void;
// };

// const ProductDetail: React.FC<BookingModalProps> = ({}) => {
//   const { addToCart, getCartItemCount } = useCart();
//   const [days, setDays] = useState(1);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [showLimitAlert, setShowLimitAlert] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();
//   const [bike, setBike] = useState<BikeData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const bikeId = "BIKE1757160484569000";
//   const { URL } = useAppContext();

//   const getBikesById = async () => {
//     setIsLoading(true);
//     try {
//       let res = await fetch(`${URL}bike/getById/${bikeId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         }
//       });

//       if (res.status === 200) {
//         const result = await res.json();
//         setBike(result.data);
        
//         // Set default location to first available vehicle's location
//         const availableVehicles = result.data.vehicles.filter((v: Vehicle) => v.status === 'AVAILABLE');
//         if (availableVehicles.length > 0) {
//           setSelectedLocation(availableVehicles[0].location);
//           setSelectedVehicle(availableVehicles[0]);
//         }
//       } else {
//         showAlert("Failed to load bike details. Please try again.", "error");
//       }
//     } catch (error) {
//       console.error("Bike fetch error:", error);
//       showAlert("Failed to load bike details. Please try again.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getBikesById();
//   }, []);

//   useEffect(() => {
//     if (showLimitAlert) {
//       const timeout = setTimeout(() => setShowLimitAlert(false), 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [showLimitAlert]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4 py-8">
//         <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl shadow-2xl">
//           <div className="p-4 sm:p-6 flex justify-center items-center h-32 sm:h-64">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#AC9456]"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!bike) return null;

//   const isWeekend = () => {
//     const day = new Date().getDay();
//     return day === 0 || day === 6; // Sunday or Saturday
//   };

//   const basePrice = bike.pricing.basePrice;
//   const finalPrice = isWeekend() ? basePrice * bike.pricing.weekendMultiplier : basePrice;
//   const totalPrice = finalPrice * days;
//   const kmChargePerKm = 5;

//   const availableVehicles = bike.vehicles.filter(v => v.status === 'AVAILABLE');
//   const uniqueLocations = [...new Set(availableVehicles.map(v => v.location))];

//   const handleLocationChange = (location: string) => {
//     setSelectedLocation(location);
//     const vehicleAtLocation = availableVehicles.find(v => v.location === location);
//     setSelectedVehicle(vehicleAtLocation || null);
//   };

//   const handleAddToCart = () => {
//       if (!selectedVehicle) {
//           showAlert("Please select a location first.", "error");
//           return;
//         }
        
//         if (bike.counters.available === 0) {
//             setShowLimitAlert(true);
//             return;
//         }
        
//         const cartItem = {
//             _id: bike.bikeId,
//             brand: bike.modelInfo.brand,
//             model: bike.modelInfo.model,
//       type: bike.modelInfo.type,
//       transmission: bike.modelInfo.transmission,
//       price_per_day_INR: finalPrice,
//       imageUrl: bike.modelInfo.imageUrl,
//       selectedLocation: selectedLocation,
//       selectedVehicle: selectedVehicle.vehicleId,
//       days: days,
//       quantity: 1,
//         colors:   [], // If bike has colors
//         selectedColor:"", // If bike has a default color
        
//     };
    
//     addToCart(cartItem);
//     console.log("clickeddd")
//     showAlert("Added to cart successfully!", "success");
//   };

//   const handleBookNow = () => {
//     if (!selectedVehicle) {
//       showAlert("Please select a location first.", "error");
//       return;
//     }
//     // onBookNow?.(bike, days, selectedLocation);
//     showAlert("Booking feature coming soon!", "info");
//   };

//   const decrementDays = () => {
//     setDays(prev => Math.max(1, prev - 1));
//   };

//   const incrementDays = () => {
//     setDays(prev => prev + 1);
//   };

//   const getConditionColor = (condition: string) => {
//     switch (condition) {
//       case 'EXCELLENT': return 'text-green-600 bg-green-100';
//       case 'GOOD': return 'text-blue-600 bg-blue-100';
//       case 'FAIR': return 'text-yellow-600 bg-yellow-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 bg-gray-50">
//       <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl shadow-2xl">
//         <div className="p-3 sm:p-4 md:p-6">
//           <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
//             {/* Image Section */}
//             <div className="lg:w-1/2">
//               <div className="relative h-48 sm:h-56 md:h-64 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden">
//                 <img
//                   src={bike.modelInfo.imageUrl}
//                   alt={`${bike.modelInfo.brand} ${bike.modelInfo.model}`}
//                   className="w-full h-full object-contain"
//                 />
//                 {isWeekend() && (
//                   <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
//                     Weekend Pricing (+{((bike.pricing.weekendMultiplier - 1) * 100).toFixed(0)}%)
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Details Section */}
//             <div className="lg:w-1/2 space-y-3 md:space-y-4">
//               <div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
//                   {bike.modelInfo.brand} {bike.modelInfo.model}
//                 </h3>
//                 <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm inline-block mb-3 md:mb-4">
//                   {bike.counters.available > 0 ? `${bike.counters.available} Available` : 'Not Available'}
//                 </div>
//               </div>

//               <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
//                 {bike.modelInfo.description}
//               </p>

//               <div className="space-y-2 md:space-y-3">
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
//                   <span className="text-gray-700 text-xs sm:text-sm">
//                     <strong>Type:</strong> {bike.modelInfo.type} {bike.modelInfo.category}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
//                   <span className="text-gray-700 text-xs sm:text-sm">
//                     <strong>Transmission:</strong> {bike.modelInfo.transmission}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
//                   <span className="text-gray-700 text-xs sm:text-sm">
//                     <strong>Engine:</strong> {bike.modelInfo.specifications.engine}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
//                   <span className="text-gray-700 text-xs sm:text-sm">
//                     <strong>Mileage:</strong> {bike.modelInfo.specifications.mileage}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
//                   <span className="text-gray-700 text-xs sm:text-sm">
//                     <strong>Top Speed:</strong> {bike.modelInfo.specifications.topSpeed}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Location Selection */}
//           <div className="mb-4 md:mb-6">
//             <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm sm:text-base">
//               <MapPinIcon className="w-4 h-4 text-[#AC9456]" />
//               Choose Pickup Location
//             </h4>
//             <div className="grid gap-2 md:gap-3">
//               {uniqueLocations.map((location) => {
//                 const vehicleAtLocation = availableVehicles.find(v => v.location === location);
//                 const isSelected = selectedLocation === location;

//                 return (
//                   <button
//                     key={location}
//                     onClick={() => handleLocationChange(location)}
//                     className={`p-3 md:p-4 rounded-lg md:rounded-xl text-left transition-all duration-200 border-2
//                       ${isSelected
//                         ? "border-[#AC9456] bg-[#AC9456]/5"
//                         : "border-gray-200 hover:border-gray-300 bg-white"
//                       }`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-900 text-sm sm:text-base">{location}</p>
//                         {vehicleAtLocation && (
//                           <p className="text-xs sm:text-sm text-gray-600 mt-1">
//                             Vehicle: {vehicleAtLocation.vehicleNumber}
//                           </p>
//                         )}
//                       </div>
//                       {vehicleAtLocation && (
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getConditionColor(vehicleAtLocation.condition)}`}>
//                           {vehicleAtLocation.condition}
//                         </span>
//                       )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Duration Selection */}
//           <div className="mb-4 md:mb-6">
//             <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm sm:text-base">Rental Duration</h4>
//             <div className="flex items-center justify-center space-x-4">
//               <button
//                 onClick={decrementDays}
//                 className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 disabled={days <= 1}
//               >
//                 <Minus className="w-4 h-4" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-4 h-4 text-[#AC9456]" />
//                 <span className="text-base sm:text-lg font-semibold min-w-[60px] text-center">
//                   {days} {days === 1 ? "day" : "days"}
//                 </span>
//               </div>
//               <button
//                 onClick={incrementDays}
//                 className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Price Breakdown */}
//           <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
//             <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm sm:text-base">Price Details</h4>
//             <div className="space-y-2 md:space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700 text-xs sm:text-sm">Base Price per day</span>
//                 <span className="font-medium text-sm sm:text-base">₹{basePrice}</span>
//               </div>
//               {isWeekend() && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-700 text-xs sm:text-sm">Weekend Surcharge ({((bike.pricing.weekendMultiplier - 1) * 100).toFixed(0)}%)</span>
//                   <span className="font-medium text-orange-600 text-sm sm:text-base">- ₹{finalPrice - basePrice}</span>
//                 </div>
//               )}
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700 text-xs sm:text-sm">Price per day</span>
//                 <span className="font-medium text-sm sm:text-base">₹{finalPrice}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700 text-xs sm:text-sm">Duration</span>
//                 <span className="font-medium text-sm sm:text-base">{days} {days === 1 ? "day" : "days"}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700 text-xs sm:text-sm">Subtotal</span>
//                 <span className="font-medium text-sm sm:text-base">₹{totalPrice}</span>
//               </div>
//               {bike.pricing.taxIncluded && (
//                 <div className="flex justify-between items-center text-xs sm:text-sm">
//                   <span className="text-gray-600">Taxes</span>
//                   <span className="text-gray-600">Included</span>
//                 </div>
//               )}
//               <div className="border-t border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
//                   <span className="text-lg sm:text-xl font-bold text-[#AC9456]">₹{totalPrice}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Extra Charges Info */}
//             <div className="mt-3 md:mt-4 p-3 md:p-4 bg-amber-50 rounded-lg md:rounded-xl border border-amber-200">
//               <div className="flex items-start space-x-2">
//                 <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
//                 <div className="text-xs sm:text-sm text-amber-800">
//                   <p className="font-medium">Additional Charges:</p>
//                   <p>₹{kmChargePerKm}/km will be charged for distance beyond 100km/day</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {showLimitAlert && (
//             <div className="text-red-600 text-xs sm:text-sm font-medium mb-4 text-center">
//               No vehicles available at the moment. Please try again later.
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
//             <button
//               onClick={handleAddToCart}
//               disabled={bike.counters.available === 0 || !selectedVehicle}
//               className="flex-1 py-2.5 cursor-pointer md:py-3 border border-[#AC9456] text-[#AC9456] hover:bg-[#AC9456]/10 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//             >
//               Add to Cart
//             </button>

//             <button
//               onClick={handleBookNow}
//               disabled={bike.counters.available === 0 || !selectedVehicle}
//               className="flex-1 py-2.5 cursor-pointer md:py-3 bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//             >
//               Book Now
//             </button>
//           </div>
//         </div>
//       </div>
//        <Alert alert={alert} hideAlert={hideAlert} />
//     </div>
//   );
// };

// export default ProductDetail;



"use client";
import React, { useEffect, useState } from "react";
import { X, Plus, Minus, MapPin, Calendar, Star, MapPinIcon } from "lucide-react";
import { useCart } from "@/hooks/CartContext";
import { useAlert } from "@/hooks/alertHook";
import { useAppContext } from "@/hooks/context";
import SuccessModal from "@/components/modal/successModal";
import FailureModal from "@/components/modal/FailureModal";

// Updated Types based on new data structure
interface BikeSpecifications {
  engine: string;
  mileage: string;
  fuelType: string;
  weight: string;
  topSpeed: string;
}

interface BikeModelInfo {
  brand: string;
  model: string;
  category: string;
  type: string;
  transmission: string;
  description: string;
  imageUrl: string;
  specifications: BikeSpecifications;
}

interface VehicleMetadata {
  holdExpiryTime?: string;
  lastServiceDate: string;
  nextServiceDue: string;
  totalKms: number;
  purchaseDate: string;
  lastUpdated: string;
}

interface Vehicle {
  vehicleId: string;
  vehicleNumber: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE";
  condition: "EXCELLENT" | "GOOD" | "FAIR";
  location: string;
  metadata: VehicleMetadata;
}

interface Pricing {
  basePrice: number;
  weekendMultiplier: number;
  currency: string;
  taxIncluded: boolean;
}

interface Counters {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  inactive: number;
}

type BikeData = {
  bikeId: string;
  modelInfo: BikeModelInfo;
  pricing: Pricing;
  vehicles: Vehicle[];
  counters: Counters;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BookingModalProps = {
  bike?: BikeData | null;
  isOpen?: boolean;
  onClose?: () => void;
  onBookNow?: (bike: BikeData, days: number, selectedLocation: string) => void;
};

const ProductDetail: React.FC<BookingModalProps> = ({}) => {
  const { addToCart, getCartItemCount } = useCart();
  const [days, setDays] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const [bike, setBike] = useState<BikeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const bikeId = "BIKE1757160484569000";
  const { URL } = useAppContext();

  const getBikesById = async () => {
    setIsLoading(true);
    try {
      let res = await fetch(`${URL}bike/getById/${bikeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (res.status === 200) {
        const result = await res.json();
        setBike(result.data);
        
        // Set default location to first available vehicle's location
        const availableVehicles = result.data.vehicles.filter((v: Vehicle) => v.status === 'AVAILABLE');
        if (availableVehicles.length > 0) {
          setSelectedLocation(availableVehicles[0].location);
          setSelectedVehicle(availableVehicles[0]);
        }
      } else {
        showAlert("Failed to load bike details. Please try again.", "error");
      }
    } catch (error) {
      console.error("Bike fetch error:", error);
      showAlert("Failed to load bike details. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

      const handleCloseSuccessModal= () => {
      setShowSuccessModal(false);
      setIsProcessing(false);
    }
      const handleCloseFailureModal= () => {
      setShowFailureModal(false);
      setIsProcessing(false);
    }

    console.log(selectedVehicle, "selectedVehicle");


      const createOrder = async () => {
    // if (!selectedVehicle) {
    //   showAlert("Please select a location first.", "error");
    //   return;
    // }

    setIsProcessing(true);

    const now = new Date();
    const fromDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const toDate = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);

    // const bookingData = {
    //   userId: "USR1754833148052000",
    //   vehicles: [
    //     {
    //       bikeId: bike.bikeId,
    //       vehicleNumber: selectedVehicle.vehicleNumber
    //     }
    //   ],
    //   fromDate: fromDate.toISOString(),
    //   toDate: toDate.toISOString(),
    //   features: {
    //     insuranceIncluded: false,
    //     deliveryRequired: false
    //   }
    // };


    const bookingData = {
            "userId": "64f1a7b2c1234abcd5678ef9",
            "vehicles": [
              {
                "bikeId": "BIKE1757160484569000",
                "vehicleNumber": "KA01AB1234"
              }
            ],
            "fromDate": "2025-09-10T09:00:00.000Z",
            "toDate": "2025-09-12T09:00:00.000Z"
          }

    try {
      const res = await fetch(`${URL}booking/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
          // Load Razorpay dynamically
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            initializeRazorpay(result);
          };
          script.onerror = () => {
            setIsProcessing(false);
            showAlert("Failed to load payment gateway. Please try again.", "error");
          };
          document.body.appendChild(script);
        } else {
          initializeRazorpay(result);
        }
      } else {
        const errorData = await res.json();
        setIsProcessing(false);
        showAlert(errorData.message || "Failed to create order", "error");
      }
    } catch (error) {
      console.error("Create order error:", error);
      setIsProcessing(false);
      showAlert("Failed to create order. Please try again.", "error");
    }
  };


    const initializeRazorpay = (orderData) => {
    const options = {
      key: orderData.data.razorpayKey ,
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      name: "Bike Booking Service",
      description: `Booking for ${bike.modelInfo.brand} ${bike.modelInfo.model}`,
      order_id: orderData.data.orderId,
      handler: function (response) {
        verifyPayment(response, orderData.data.booking.bookingId);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#AC9456",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          console.log("Payment cancelled by user");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

    const verifyPayment = async (response, bookingId) => {
    try {
      const verificationData = {
        bookingId: bookingId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };

      const verifyResponse = await fetch(`${URL}booking/confirmBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      setIsProcessing(false);

      if (verifyResponse.ok) {
        const result = await verifyResponse.json();
        setBookingDetails({
          bookingId: bookingId,
          paymentId: response.razorpay_payment_id,
          amount: totalPrice
        });
        setShowSuccessModal(true);
      } else {
        const errorData = await verifyResponse.json();
        setErrorMessage(errorData.message || "Payment verification failed");
        setShowFailureModal(true);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setIsProcessing(false);
      setErrorMessage("Payment verification failed");
      setShowFailureModal(true);
    }
  };

  useEffect(() => {
    getBikesById();
  }, []);

  useEffect(() => {
    if (showLimitAlert) {
      const timeout = setTimeout(() => setShowLimitAlert(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showLimitAlert]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl shadow-2xl">
          <div className="p-4 sm:p-6 flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#AC9456]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bike) return null;

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const basePrice = bike.pricing.basePrice;
  const finalPrice = isWeekend() ? basePrice * bike.pricing.weekendMultiplier : basePrice;
  const totalPrice = finalPrice * days;
  const kmChargePerKm = 5;

  const availableVehicles = bike.vehicles.filter(v => v.status === 'AVAILABLE');
  const uniqueLocations = [...new Set(availableVehicles.map(v => v.location))];

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    const vehicleAtLocation = availableVehicles.find(v => v.location === location);
    setSelectedVehicle(vehicleAtLocation || null);
  };

  const handleAddToCart = () => {
    if (!selectedVehicle) {
      showAlert("Please select a location first.", "error");
      return;
    }

    if (bike.counters.available === 0) {
      setShowLimitAlert(true);
      return;
    }

    const cartItem = {
      _id: bike.bikeId,
      brand: bike.modelInfo.brand,
      model: bike.modelInfo.model,
      type: bike.modelInfo.type,
      transmission: bike.modelInfo.transmission,
      price_per_day_INR: finalPrice,
      imageUrl: bike.modelInfo.imageUrl,
      selectedLocation: selectedLocation,
      selectedVehicle: selectedVehicle.vehicleId,
      days: days,
      quantity: 1,
    };

    addToCart(cartItem);
    showAlert("Added to cart successfully!", "success");
  };

  const handleBookNow = () => {
    if (!selectedVehicle) {
      showAlert("Please select a location first.", "error");
      return;
    }
    // onBookNow?.(bike, days, selectedLocation);
    showAlert("Booking feature coming soon!", "info");
  };

  const decrementDays = () => {
    setDays(prev => Math.max(1, prev - 1));
  };

  const incrementDays = () => {
    setDays(prev => prev + 1);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return 'text-green-600 bg-green-100';
      case 'GOOD': return 'text-blue-600 bg-blue-100';
      case 'FAIR': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 bg-gray-50">
      <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl shadow-2xl">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <div className="relative h-48 sm:h-56 md:h-64 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={bike.modelInfo.imageUrl}
                  alt={`${bike.modelInfo.brand} ${bike.modelInfo.model}`}
                  className="w-full h-full object-contain"
                />
                {isWeekend() && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Weekend Pricing (+{((bike.pricing.weekendMultiplier - 1) * 100).toFixed(0)}%)
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 space-y-3 md:space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {bike.modelInfo.brand} {bike.modelInfo.model}
                </h3>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm inline-block mb-3 md:mb-4">
                  {bike.counters.available > 0 ? `${bike.counters.available} Available` : 'Not Available'}
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {bike.modelInfo.description}
              </p>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    <strong>Type:</strong> {bike.modelInfo.type} {bike.modelInfo.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    <strong>Transmission:</strong> {bike.modelInfo.transmission}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    <strong>Engine:</strong> {bike.modelInfo.specifications.engine}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    <strong>Mileage:</strong> {bike.modelInfo.specifications.mileage}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-[#AC9456] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-xs sm:text-sm">
                    <strong>Top Speed:</strong> {bike.modelInfo.specifications.topSpeed}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <div className="mb-4 md:mb-6">
            <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <MapPinIcon className="w-4 h-4 text-[#AC9456]" />
              Choose Pickup Location
            </h4>
            <div className="grid gap-2 md:gap-3">
              {uniqueLocations.map((location) => {
                const vehicleAtLocation = availableVehicles.find(v => v.location === location);
                const isSelected = selectedLocation === location;

                return (
                  <button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    className={`p-3 md:p-4 rounded-lg md:rounded-xl text-left transition-all duration-200 border-2
                      ${isSelected
                        ? "border-[#AC9456] bg-[#AC9456]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{location}</p>
                        {vehicleAtLocation && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Vehicle: {vehicleAtLocation.vehicleNumber}
                          </p>
                        )}
                      </div>
                      {vehicleAtLocation && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getConditionColor(vehicleAtLocation.condition)}`}>
                          {vehicleAtLocation.condition}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-4 md:mb-6">
            <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm sm:text-base">Rental Duration</h4>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={decrementDays}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                disabled={days <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#AC9456]" />
                <span className="text-base sm:text-lg font-semibold min-w-[60px] text-center">
                  {days} {days === 1 ? "day" : "days"}
                </span>
              </div>
              <button
                onClick={incrementDays}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm sm:text-base">Price Details</h4>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-xs sm:text-sm">Base Price per day</span>
                <span className="font-medium text-sm sm:text-base">₹{basePrice}</span>
              </div>
              {isWeekend() && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-xs sm:text-sm">Weekend Surcharge ({((bike.pricing.weekendMultiplier - 1) * 100).toFixed(0)}%)</span>
                  <span className="font-medium text-orange-600 text-sm sm:text-base">₹{finalPrice - basePrice}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-xs sm:text-sm">Price per day</span>
                <span className="font-medium text-sm sm:text-base">₹{finalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-xs sm:text-sm">Duration</span>
                <span className="font-medium text-sm sm:text-base">{days} {days === 1 ? "day" : "days"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-xs sm:text-sm">Subtotal</span>
                <span className="font-medium text-sm sm:text-base">₹{totalPrice}</span>
              </div>
              {bike.pricing.taxIncluded && (
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-600">Included</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-[#AC9456]">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Extra Charges Info */}
            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-amber-50 rounded-lg md:rounded-xl border border-amber-200">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-amber-800">
                  <p className="font-medium">Additional Charges:</p>
                  <p>₹{kmChargePerKm}/km will be charged for distance beyond 100km/day</p>
                </div>
              </div>
            </div>
          </div>

          {showLimitAlert && (
            <div className="text-red-600 text-xs sm:text-sm font-medium mb-4 text-center">
              No vehicles available at the moment. Please try again later.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <button
              onClick={handleAddToCart}
              // disabled={bike.counters.available === 0 || !selectedVehicle}
              className="flex-1 py-2.5 md:py-3 border border-[#AC9456] text-[#AC9456] hover:bg-[#AC9456]/10 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Add to Cart
            </button>

            <button
              onClick={createOrder}
              // disabled={bike.counters.available === 0 || !selectedVehicle}
              className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-[#AC9456] to-[#D4B76A] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Book Now
            </button>
          </div>
        </div>

     
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} bookingDetails={bookingDetails} />
      <FailureModal isOpen={showFailureModal} onClose={handleCloseFailureModal} errorMessage={errorMessage} />
    </div>
  );
};

export default ProductDetail;










