import React, { useState } from 'react'
import edit from '../assets/icons/edit.png'
// UI
import SecondaryButton from './Buttons/SecondaryButton'
import { useNavigate } from 'react-router-dom'
// icons
import { X } from 'lucide-react';

export default function Modal({ type, open, onClose, onClick, children, ...props }) {

  
  let navigate = useNavigate();

  const handleLoginButton = () => {
    localStorage.removeItem("userToken")
    navigate('/login')
  }
  const handleCloseModle = () => {
    onClose(false)
  }

  switch (type) {

    case 'create-playlist':
      return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${open ? "visible bg-black/80" : "invisible"}`}>
        <div className='bg-gray-800 p-3 rounded-lg'>
          <div className='flex justify-between items-center'>
            <h5>Create playlist</h5>
            <X  onClick={handleCloseModle}/>
          </div>
          <div className=' my-3 flex justify-start items-stretch gap-3'>
            <div className=''>
              <input  type="text" className='block mb-2 w-60 rounded-lg p-2 border-2' placeholder='Name' />
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
      return (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${open ? "visible bg-black/80" : "invisible"}`}>
          <div className='bg-[#232323] rounded-xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl p-6 relative animate-fadeIn"'>
            <h6 className='text-2xl font-bold capitalize my-4'>Delete from Your Library?</h6>
            <p>This will delete Fav songs from Your Library.</p>
            <SecondaryButton>Delete</SecondaryButton>
            <SecondaryButton>Cancel</SecondaryButton>
          </div>
        </div>
      )

  }
  
}

// export default function Modal({
//   open,
//   title,
//   children,
//   onClose,
//   actions,
//   size = "md", // sm | md | lg
// }) {
//    console.log('Modal opened');
//   if (!open) return null;
   
//   const sizes = {
//     sm: "max-w-sm",
//     md: "max-w-md",
//     lg: "max-w-xl",
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className={`bg-white rounded-xl p-6 w-full ${sizes[size]} relative`}>
        
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           <X/>
//         </button>

//         {/* Title */}
//         {title && (
//           <h2 className="text-xl font-semibold mb-4">
//             {title}
//           </h2>
//         )}

//         {/* Body */}
//         <div className="mb-4">
//           {children}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3">
//           {actions}
//         </div>
//       </div>
//     </div>
//   );
// }

