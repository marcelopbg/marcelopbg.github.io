"use client";
import React, { useEffect, useState } from "react";
import CheckoutModal from "../components/CheckoutModal";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal"; // Import the new component
import { useLogin } from "../context/LoginContext";
import { useRouter } from "next/navigation";
import { toastErrorDefault, toastSuccessDefault } from "../common/toast-default-option";
import toast from "react-hot-toast";

interface UserPlanInfo {
  email: string;
  plan: string;
  current_period_end: number;
  current_period_start: number;
  isCancelled: boolean;
}

const PlansPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // State for cancel modal
  const [userPlanInfo, setUserPlanInfo] = useState<UserPlanInfo | null>(null);
  const loginContext = useLogin();
  const router = useRouter();

  const redirectRegistration = (plan?: string) => {
    if (plan) {
      router.push(`registration?plan=${plan}`);
      return;
    }
    router.push("registration");
  };

  const freePlanClick = () => {
    if (!loginContext.isLoggedIn) {
      redirectRegistration("Free");
      return;
    }
    if(userPlanInfo?.plan === 'Premium') {
      setIsCancelModalOpen(true);
      return;
    }
  };

  const planClick = (plan: string) => {
    if (!loginContext.isLoggedIn) {
      redirectRegistration(plan);
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const openCancelModal = () => setIsCancelModalOpen(true);
  const closeCancelModal = () => setIsCancelModalOpen(false);

  // Handle cancellation logic
  const handleSubscriptionCancellation = async () => {
    const token = localStorage.getItem("exam-prep-tk");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/subscription`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      toast.success("Your subscription has been cancelled. You will have access until the end of the current billing cycle.", toastSuccessDefault);
      closeCancelModal();
      getUserInformation();
    } else {
      console.error("Failed to cancel subscription");
      toast.error("An error occurred while trying to cancel your subscription. Please try again.", toastErrorDefault);
    }
  };

  // Fetch user plan information if logged in
  const getUserInformation = async () => {
    const token = localStorage.getItem("exam-prep-tk");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data: UserPlanInfo = await response.json();
      setUserPlanInfo(data);
    } else {
      console.error("Failed to fetch user plan information");
    }
  };

  useEffect(() => {
    if (loginContext.isLoggedIn) {
      getUserInformation();
    }
  }, [loginContext.isLoggedIn]);

  return (
    <div className="md:h-94 overflow-hidden flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-blue-500 p-8 rounded w-full md:w-auto flex items-center justify-center flex-col">
        {userPlanInfo && (
          <div className="bg-white p-4 rounded-lg shadow-lg text-center mb-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold">Your Current Plan</h2>
            <p className="mt-2 text-lg">
              <span className="font-bold">Plan:</span> {userPlanInfo.plan}
            </p>
            <p className="mt-1 text-lg">
              <span className="font-bold">Period Started At:</span> {userPlanInfo.current_period_start ? new Date(userPlanInfo.current_period_start * 1000).toLocaleDateString() : 'N/A'}
            </p>
            <p className="mt-1 text-lg">
              <span className="font-bold">Period Ends At:</span> {userPlanInfo.current_period_end ? new Date(userPlanInfo.current_period_end * 1000).toLocaleDateString() : 'N/A'}
            </p>
            {userPlanInfo.plan !== 'Free' && (
              <button
                onClick={openCancelModal} // Open the cancel modal
                disabled={userPlanInfo.isCancelled}
                className={userPlanInfo.isCancelled ? "mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-500  cursor-not-allowed opacity-50" : "mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-600"}
              >
                {userPlanInfo.isCancelled ? "Subscription Cancelled" : "Cancel Subscription"}
              </button>
            )}
          </div>
        )}
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Our Plans</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-6">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Free / Demo</h2>
              <p className="text-lg mb-4">Try out the service with limited access.</p>
              <p className="text-4xl font-bold text-gray-500 mb-4">0$</p>
              <p className="text-gray-600 mb-8">10 questions per day</p>
            </div>
            <button
              className={`w-full py-3 px-4 rounded-md ${userPlanInfo?.plan === 'Free' || userPlanInfo?.isCancelled
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              onClick={freePlanClick}
              disabled={userPlanInfo?.plan === 'Free' || userPlanInfo?.isCancelled}
            >
              {userPlanInfo?.isCancelled ? 'Downgrade Scheduled' : userPlanInfo?.plan === 'Premium' ? 'Downgrade' : userPlanInfo?.plan === 'Free' ? 'Owned' : 'Choose Plan'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Premium</h2>
              <p className="text-lg mb-4">Unlimited access to all questions.</p>
              <p className="text-4xl font-bold text-green-500 mb-4">10$</p>
              <p className="text-gray-600 mb-8">Unlimited questions per day</p>
            </div>
            <button
              className={`w-full py-3 px-4 rounded-md ${userPlanInfo?.plan === 'Premium'
                ? 'bg-green-400 text-white cursor-not-allowed opacity-50'
                : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              onClick={() => planClick("Premium")}
              disabled={userPlanInfo?.plan === 'Premium'}
            >
              {userPlanInfo?.plan === 'Premium' ? 'Owned' : 'Choose Plan'}
            </button>
          </div>
        </div>

      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={closeModal} selectedPlan={selectedPlan} />
      {/* Add the new CancelSubscriptionModal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleSubscriptionCancellation}
        periodEnd={userPlanInfo ? new Date(userPlanInfo.current_period_end * 1000).toLocaleDateString() : "N/A"}
      />
    </div>
  );
};

export default PlansPage;
