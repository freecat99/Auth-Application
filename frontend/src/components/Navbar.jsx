import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='navbar'>
      <img src={assets.logo} alt='logo' className='logo'></img>
      <button onClick={()=>{navigate('/login')}}>Login<img src={assets.arrow_icon}></img> </button>
    </div>
  )
}

export default Navbar
