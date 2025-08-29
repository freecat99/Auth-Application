import React, {useContext, useState} from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('login');

  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)

  const submitHandler = async(e) =>{
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true

      if(state==='register'){
        const {data} = await axios.post(backendUrl+'/api/auth/register', {name, email, password})

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }else{
        const {data} = await axios.post(backendUrl+'/api/auth/login', {email, password})

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/')
        }else{
          toast.error(data.message)
        }

      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (

    <div className='container'>

      <h2>{state==='login'?'Login':'Register'}</h2>

      <form onSubmit={submitHandler}>
        {state==='register'&&(
          <div>
          <label htmlFor='name' id='name'><img src={assets.person_icon}/></label>
          <input type='text' id='name' name='name' required placeholder='Name' onChange={e=>{setName(e.target.value)}}></input>
        </div>)}
        <div>
          <label htmlFor='email' id='email'><img src={assets.mail_icon}/></label>
          <input type='email' id='email' name='email' required placeholder='Email' onChange={e=>{setEmail(e.target.value)}}></input>
        </div>
        <div>
          <label htmlFor='password' id='password'><img src={assets.lock_icon}/></label>
          <input type='password' id='password' name='password' required placeholder='Password' onChange={e=>{setPassword(e.target.value)}}></input>
        </div>
      {state==='login'?(
        <>
        <p className='extras'><span className='forgot' onClick={()=>{navigate('/reset-password')}}>Forgot Password?</span></p>
        <button>Login</button>
        <p className='extras'>Don't have an account? <span onClick={()=>setState('register')}>Register</span> </p>    
        </>
      ):(
        <>
        <button>Register</button>
        <p className='extras'>Already have an account? <span onClick={()=>setState('login')}>Login</span> </p>    
        </>
      )}
      </form>
    </div>
  )
}

export default Login
