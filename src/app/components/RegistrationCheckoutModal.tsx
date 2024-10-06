import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

// Replace with your Stripe public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_APP_KEY!);

interface RegistraitonCheckoutModalProps {
  isOpen: boolean;
  sessionId: string;
  onClose: () => void;
}

const RegistrationCheckoutModal: React.FC<RegistraitonCheckoutModalProps> = ({ isOpen, onClose, sessionId }) => {

  const options = { clientSecret: sessionId };

  if (!isOpen || !sessionId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-white rounded-lg shadow-lg w-full h-full max-h-screen lg:max-h-[90%] lg:max-w-6xl lg:h-[90vh] overflow-y-auto p-6"
      >
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default RegistrationCheckoutModal;
