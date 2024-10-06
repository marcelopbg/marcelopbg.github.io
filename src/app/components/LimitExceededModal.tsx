import React from 'react';
import { useRouter } from 'next/navigation';

interface LimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LimitExceededModal: React.FC<LimitExceededModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleUpgradePlan = () => {
    router.push('/plans');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Daily Question Limit Reached</h2>

        <p className="mb-4 text-gray-700 text-center">
          You have reached the daily limit of questions available for your current plan.
          You can try again tomorrow or consider upgrading your plan to access more questions.
        </p>

        <div className="flex justify-center space-x-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Close
          </button>
          
          {/* Upgrade Plan Button */}
          <button
            onClick={handleUpgradePlan}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitExceededModal;
