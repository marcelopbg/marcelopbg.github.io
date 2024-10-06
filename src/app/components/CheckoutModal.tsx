import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { toastErrorDefault } from '../common/toast-default-option';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Replace with your Stripe public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_APP_KEY!);

interface CheckoutModalProps {
  isOpen: boolean;
  selectedPlan: string | null;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const router = useRouter();

  const fetchClientSecret = useCallback(async () => {
    const token = localStorage.getItem("exam-prep-tk");
    const requestBody = { plan: selectedPlan! };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      onClose();
      if (response.status === 401) {
        localStorage.removeItem("exam-prep-tk");
        router.push('/login');
        toast.error("Session expired. Please login again", toastErrorDefault);
        throw new DOMException('Error');
      }
      toast.error("Failed to create checkout session", toastErrorDefault);
      throw new DOMException('Error');
    }
    return await response.text();
  }, [onClose, router, selectedPlan]);

  const options = { fetchClientSecret };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full h-full max-h-screen lg:max-h-[90%] lg:max-w-6xl lg:h-[90vh] overflow-y-auto p-6"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

        {/* Stripe Checkout Form */}
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default CheckoutModal;
