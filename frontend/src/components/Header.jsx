import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContext);
  return (

    <div className='header'>  
      <h1 className='greet'>Hello {userData?userData.name:'Hooman'} <img src={assets.hand_wave} className='helloImage'/> </h1>
      <h3>Welcome to my app</h3>
      <p>Let's <button>get started</button></p>
    </div>
  )
}

export default Header
