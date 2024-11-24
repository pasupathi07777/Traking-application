import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/auth/auth.slice';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(email));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Reset Password</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
