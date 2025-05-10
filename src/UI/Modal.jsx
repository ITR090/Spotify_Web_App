import React, { useState } from 'react'
import edit from '../assets/icons/edit.png'
// UI
import SecondaryButton from './Buttons/SecondaryButton'
import { useNavigate  } from 'react-router-dom'


export default function Modal({ type, open, onClose, onClick }) {


  let navigate = useNavigate();

  const handleLoginButton =()=>{
    localStorage.removeItem("userToken")
    navigate('/login')
  }
  const handleCloseModle = () => {
    onClose(false)
  }
  
  switch (type) {

    case 'create-playlist':
      return (<div className={`fixed top-0 right-0 left-0 z-50 inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/80" : "invisible"}`}>
        <div className='bg-[#232323] p-3 rounded-lg'>
          <div className='flex justify-between items-center'>
            <h5 className='text-xl font-medium'>Create playlist</h5>
            <p onClick={handleCloseModle} className='text-lg font-bold'>X</p>
          </div>
          <div className=' my-3 flex justify-start items-stretch gap-3'>
            <div className='w-100'>
              <input type="text" className='block mb-2 rounded-lg w-60 p-2 bg-[#3e3e3e]' placeholder='Name' />
              <textarea name="" id="" className='p-2 block rounded-lg w-60 bg-[#3e3e3e] h-auto' placeholder='Add an optional description' ></textarea>
            </div>
          </div>
          <SecondaryButton clickFun={onClick} className='text-left'>Save</SecondaryButton>
        </div>
      </div>)

    case 'token-expired':
      return (
        <div className={`fixed top-0 right-0 left-0 z-50 inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/80" : "invisible"}`}>
          <div className='bg-[#232323] p-3 rounded-lg'>
            <h6 className='text-2xl font-bold capitalize my-4'>Your token has expired please login</h6>
            <SecondaryButton clickFun={handleLoginButton}>Login</SecondaryButton>
          </div>
        </div>
      )

    case 'delete-playlist': 
       return(
        <div className={`fixed top-0 right-0 left-0 z-50 inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/80" : "invisible"}`}>
          <div className='bg-[#232323] p-3 rounded-lg'>
            <h6 className='text-2xl font-bold capitalize my-4'>Delete from Your Library?</h6>
            <p>This will delete Fav songs from Your Library.</p>
            <SecondaryButton>Delete</SecondaryButton>
            <SecondaryButton>Cancel</SecondaryButton>
          </div>
        </div>
       ) 
  }



}
