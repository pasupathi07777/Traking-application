import React from 'react'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import PasswordResetForm from './components/PasswordResetForm'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './layout/authLayout'

const App = () => {
  return (
    <div>
      <Routes>


        <Route path='/' element={<AuthLayout />}>
          <Route path='login' element={<LoginForm />} />
          <Route path='signup' element={<SignupForm />} />
          <Route path='PasswordReset' element={<PasswordResetForm />} />
        </Route>

        
      </Routes>







    </div>
  )
}

export default App
