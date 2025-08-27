import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='header'>
      <img src={assets.header_img} className='headerImage'></img>
      <h1 className='greet'>Hello Hooman <img src={assets.hand_wave} className='helloImage'/> </h1>
      <h3>Welcome to my app</h3>
      <p>Let's <button>get started</button></p>
    </div>
  )
}

export default Header
