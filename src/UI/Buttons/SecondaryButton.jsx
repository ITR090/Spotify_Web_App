import React from 'react'

export default function SecondaryButton({ styles, type, clickFun, id, children, ...props}) {
   return (
      <button
         {...props}
         onClick={clickFun}
         className="text-sm rounded-2xl px-3 py-2 mr-2 w-auto text-white font-bold hover:bg-black"
         id={id}
         type={type}
      >
         {children}
      </button>
   )
}
