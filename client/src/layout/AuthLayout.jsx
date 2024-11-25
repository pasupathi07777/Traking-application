import React from 'react'
import {Outlet} from 'react-router-dom' 
import PrivateRoute from '../route/PrivateRoute'

const AuthLayout = () => {
  return (
    <div>
        <Outlet/>
        {/* <PrivateRoute/> */}
    </div>
  )
}

export default AuthLayout
