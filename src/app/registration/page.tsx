"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { toastErrorDefault, toastSuccessDefault } from '../common/toast-default-option';
import { useLoading } from '../context/LoadingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import RegistrationCheckoutModal from '../components/RegistrationCheckoutModal';

const plans = [
  { id: "Free", name: "Free / Demo", price: "0$", features: '10 questions per day' },
  { id: "Premium", name: "Premium Plan", price: "$5/month", features: 'Unlimited questions' },
];

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>('Free');
  const [checkoutSessionId, setCheckoutSessionId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  
  const planParam = searchParams.get('plan');
  useEffect(() => {
    if (planParam) {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  const loadingContext = useLoading();
  const router = useRouter();

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };
  
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error("Please select a plan", toastErrorDefault);
      return;
    }

    loadingContext.showLoading();

    const requestBody = {
      name,
      email,
      password,
      plan: selectedPlan,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const responseBody = await response.text();
      if(responseBody && responseBody != 'Ok') {
        setCheckoutSessionId(responseBody);
        loadingContext.hideLoading();
        setIsModalOpen(true);
        return;
      }
      setName('');
      setEmail('');
      setPassword('');
      setSelectedPlan(null);
      toast.success('Signup successful! your email must be verified in order to login', toastSuccessDefault);
      router.push('/login');
      loadingContext.hideLoading();

    } else {
      const errorData = await response.json();
      toast.error(errorData?.message ?? 'Signup failed', toastErrorDefault);
      loadingContext.hideLoading();
    }
  };

  return (
    <div className="flex justify-center items-center h-92 bg-gray-100 p-4">
      {/* Form Container */}
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4 md:mb-6">Sign Up</h2>

        {/* Plan Selection Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap justify-center space-y-3 md:space-y-0 md:space-x-4 overflow-x-auto md:overflow-visible">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`w-full w-60 md:w-1/4 p-2 md:p-3 border rounded-lg cursor-pointer transform transition-transform duration-200 ${selectedPlan === plan.id ? 'border-blue-600' : 'border-gray-300'
                  }`}
                onClick={() => handlePlanSelection(plan.id)}
              >
                {/* Plan Details */}
                <h4 className="text-base md:text-lg font-bold text-center">{plan.name}</h4>
                <div className="flex justify-center items-baseline">
                  <p className="text-xl md:text-2xl font-semibold text-blue-500 mt-1">{plan.price}</p>
                </div>
                <p className="text-xs md:text-sm text-center text-gray-500 mt-1">{plan.features}</p>
                {/* {selectedPlan === plan.id && (
                  <span className="block text-blue-600 font-bold text-center mt-1">Selected</span>
                )} */}
              </div>
            ))}
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-3">
            <a href="/password-reset" className="text-xs md:text-sm text-blue-500 hover:underline">
              Forgot my password?
            </a>
          </div>
        </form>
      </div>
      <RegistrationCheckoutModal onClose={closeModal} isOpen={isModalOpen} sessionId={checkoutSessionId}></RegistrationCheckoutModal>
    </div>
  );
};

export default Signup;
