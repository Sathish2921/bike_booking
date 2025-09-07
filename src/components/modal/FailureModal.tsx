import { XCircle } from "lucide-react";

const FailureModal = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl animate-fadeIn">
        {/* Error Icon */}
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Sorry, we couldn’t process your payment. Please try again or contact support if the issue persists.
        </p>

        {/* Error Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-3">Error Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Error:</span>
              <span className="text-red-500">
                {errorMessage || "Payment processing failed"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Suggested Action:</span>
              <span>Try again or use another payment method</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "mailto:support@bikebooking.com")}
            className="w-full py-3 bg-gray-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailureModal;
