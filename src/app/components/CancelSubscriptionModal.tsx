import React from "react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  periodEnd: string; // End date of the current subscription period
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  periodEnd,
}) => {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
        {/* Dismiss Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-semibold mb-4">Cancel Subscription</h2>
        <p className="text-lg mb-4">
          Are you sure you want to cancel your subscription? Your access will
          remain active until the end of your current billing cycle on{" "}
          <span className="font-bold">{periodEnd}</span>.
        </p>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
