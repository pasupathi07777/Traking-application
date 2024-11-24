import React, { useState, useEffect } from 'react';
import Input from '../customComponents/Input';
import Button from '../customComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, registerUser } from '../features/auth/auth.slice';

const SignupForm = () => {
  const { error } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
    dispatch(clearError());
  };


  useEffect(() => {
    if (error) {
      const fieldErrors = {};
      error.forEach(({ message, field }) => {
        fieldErrors[field] = message; 
      });
      console.log(fieldErrors)
      setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors })); 
    }
    return () => {
      dispatch(clearError()); 
    };
  }, [error]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      dispatch(registerUser(formData)); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <Input
        label="Name"
        type="text"
        name="username"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        error={errors.username}
      />
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        error={errors.password}
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter your password"
        error={errors.confirmPassword}
      />
      <Button name="Sign Up" type="submit" />
    </form>
  );
};

export default SignupForm;
