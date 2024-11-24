import React from 'react';

const Button = ({ name, onClick, type = 'button', className, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-md text-white transition ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-indigo-500 hover:bg-indigo-600'
      } ${className}`}
    >
      {name}
    </button>
  );
};

export default Button;
