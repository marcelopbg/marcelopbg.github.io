"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import RegistrationCheckoutModal from '../components/RegistrationCheckoutModal';
import { useLogin } from '../context/LoginContext'; // Assuming an AuthContext for login status
import { toastInfoDefault, toastErrorDefault } from '../common/toast-default-option';

const StripeReturn: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { isLoggedIn } = useLogin();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      setSessionId(sessionId);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout-session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
        });
    }
  }, []);

  useEffect(() => {
    if (status === 'open') {
      toast.error('Payment failed. Please try again.', toastErrorDefault);
      setIsModalOpen(true);
    }
  }, [status]);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      router.push('/question'); // Redirect to the questions page if logged in
    } else {
      toast('Please log in to start using your newly acquired services!', toastInfoDefault);
      router.push('/login');
    }
  };

  const handleRetryPayment = () => {
    setIsModalOpen(true); // Reopen the checkout modal when "Retry Payment" is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Reopen the checkout modal when "Retry Payment" is clicked
  }

  if (status === 'complete') {
    return (
      <section id="success" className="w-94 flex justify-center items-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Thank You for Your Trust!</h2>
          <p className="mb-6">
            We appreciate you choosing our platform for your certification preparation.
            Get ready to challenge yourself and excel in your exams!
          </p>
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Begin Challenging Yourself
          </button>
        </div>
      </section>
    );
  } else if (status === 'open') {
    return (
      <section id="payment-failed" className="w-94 flex justify-center items-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
          <p className="mb-6">
            Unfortunately, your payment could not be completed. Please try again.
          </p>
          <button
            onClick={handleRetryPayment}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Retry Payment
          </button>
        </div>
        {isModalOpen && sessionId && (
          <RegistrationCheckoutModal isOpen={isModalOpen} sessionId={sessionId} onClose={closeModal}/>
        )}
      </section>
    );
  }

  return null;
};

export default StripeReturn;
