import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  errorClassName = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordInput = type === 'password';

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        {label && (
          <label
            htmlFor={name}
            className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        {error && (
          <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
        )}
      </div>
      <div className="relative">
        <input
          type={isPasswordInput && showPassword ? 'text' : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
