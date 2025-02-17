import React from 'react'

export default function SecondaryButton({type,clickFun,id,children, ...props}) {
  return (
     <button 
     {...props}
     onClick={clickFun}
     className='bg-[#2a2a2a] text-sm rounded-2xl px-3 py-2 mr-2 w-auto'
     id={id}
     type={type}
     >
        {children}
     </button>
  )
}
