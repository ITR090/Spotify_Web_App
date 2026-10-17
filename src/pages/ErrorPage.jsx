import React from 'react'
import { Link } from 'react-router-dom'
import Spotify_Logo from '../assets/Spotify_logo.png'

export default function ErrorPage() {
  return <div className='flex flex-col justify-center items-center text-center min-h-screen w-full bg-sp-base text-white p-6'>
    <img src={Spotify_Logo} alt="Spotify" className='w-14 h-14 mb-8' />
    <h4 className='text-4xl md:text-5xl font-black tracking-tight'>Something went wrong</h4>
    <p className='text-sp-subdued mt-4'>Sorry, there seems to be an issue loading the page.</p>
    <Link to='/' className='bg-main-bg-white text-main-font-black font-bold rounded-full px-8 py-3 mt-8 hover:scale-[1.04] transition-transform'>Home Page</Link>
  </div>
}
