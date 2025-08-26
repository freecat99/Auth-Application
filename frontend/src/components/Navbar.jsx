import React from 'react'
import {assets} from '../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={assets.logo} alt='logo' className='logo'></img>
      <button>Login<img src={assets.arrow_icon}></img> </button>
    </div>
  )
}

export default Navbar
