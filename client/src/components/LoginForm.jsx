import React, { useEffect, useState } from 'react';
import Input from '../customComponents/Input';
import Button from '../customComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, loginUser, registerUser } from '../features/auth/auth.slice';
import axios from 'axios';

const LoginForm = () => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  useEffect(() => {
    // if (error) {
    //   const fieldErrors = {};
    //   error.forEach(({ message, field }) => {
    //     fieldErrors[field] = message; 
    //   });
    //   console.log(fieldErrors)
    //   setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors })); 
    // }
    // return () => {
    //   dispatch(clearError()); 
    // };
    const acc = async () => {
      try {
        const responce = await axios.get("http://localhost:5000/api/auth/me")
        console.log(responce.data)
      } catch (error) {
        console.log(error)
      }
    }
    acc()
  }, [error]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Form Submitted:', formData);
      dispatch(loginUser(formData))
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
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
      <Button name="Login" type="submit" />
    </form>
  );
};

export default LoginForm;
