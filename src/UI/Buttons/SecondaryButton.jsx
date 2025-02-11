import React from 'react'

export default function SecondaryButton({type,clickFun,id,children, ...props}) {
  return (
     <button 
     {...props}
     onClick={clickFun}
     className='bg-[#2a2a2a] text-sm rounded-2xl p-1 mr-2 w-20'
     id={id}
     type={type}
     >
        {children}
     </button>
  )
}
