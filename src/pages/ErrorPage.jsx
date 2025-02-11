import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return <div className='flex flex-col justify-center items-center content-center h-screen w-screen text-xl'>
    <h4 className=''>Something went wrong</h4>
    <p>Sorry, there seems to be an issue loading the page.</p>
    <Link to='/' className='bg-main-bg-white text-main-font-black rounded-3xl px-2 py-1.5 mt-4'>Home Page</Link>
  </div>
}
