import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('login');


  return (

    <div className='container'>

      <h2>{state==='login'?'Login':'Register'}</h2>

      <form>
        {state==='register'&&(
          <div>
          <label htmlFor='name' id='name'><img src={assets.person_icon}/></label>
          <input type='text' id='name' name='name' required placeholder='Name'></input>
        </div>)}
        <div>
          <label htmlFor='email' id='email'><img src={assets.mail_icon}/></label>
          <input type='email' id='email' name='email' required placeholder='Email'></input>
        </div>
        <div>
          <label htmlFor='password' id='password'><img src={assets.lock_icon}/></label>
          <input type='password' id='password' name='password' required placeholder='Password'></input>
        </div>
      </form>
      {state==='login'?(
        <>
        <p className='extras'><span className='forgot'>Forgot Password?</span></p>
        <button>Login</button>
        <p className='extras'>Don't have an account? <span onClick={()=>setState('register')}>Register</span> </p>    
        </>
      ):(
        <>
        <button>Register</button>
        <p className='extras'>Already have an account? <span onClick={()=>setState('login')}>Login</span> </p>    
        </>
      )}
    </div>
  )
}

export default Login
