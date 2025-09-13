import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId: string;
    paymentId: string;
    amount: number;
  };
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl animate-fadeIn">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your bike has been successfully booked. You'll receive a confirmation email shortly.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-3">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span>{bookingDetails?.bookingId || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span>{bookingDetails?.paymentId || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>₹{bookingDetails?.amount ?? 0}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:opacity-90 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
