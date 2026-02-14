import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='flex justify-center items-center h-dvh overflow-y-hidden'>
      <SignIn signUpUrl='/register'/>
    </div>
  )
}

export default Login
