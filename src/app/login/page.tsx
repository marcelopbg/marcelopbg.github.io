"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toastErrorDefault } from '../common/toast-default-option';
import { useLogin } from '../context/LoginContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const loginContext = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const requestBody = { username: email, password };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        setEmail('');
        setPassword('');
        const data: { access_token: string } = await response.json();
        loginContext.login(data.access_token);
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
        
        // Error toast
        toast.error(`Login failed: ${errorData.message}`, toastErrorDefault);
      }
    } catch (err) {
      console.error(err);

      // Error toast
      toast.error('An error occurred while logging in', toastErrorDefault);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-92 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="text-center mt-4">
            <a href="/password-reset" className="text-sm text-blue-500 hover:underline">
              Forgot my password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
