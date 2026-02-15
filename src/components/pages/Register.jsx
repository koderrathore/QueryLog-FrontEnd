import { SignUp } from '@clerk/clerk-react'
import React from 'react'

const Register = () => {
  return (
    <div className='flex justify-center items-center h-dvh'>
      <SignUp signInUrl='/login'/>

    </div>
  )
}

export default Register
