import React from 'react'

// visual variants only — behaviour (onClick/type/id) is unchanged
const VARIANTS = {
   chip: 'rounded-full px-3 py-1.5 bg-sp-highlight text-white hover:bg-[#333333]',
   primary: 'rounded-full px-8 py-3 bg-white text-black hover:scale-[1.04] hover:bg-[#f0f0f0]',
   green: 'rounded-full px-8 py-3 bg-sp-green text-black hover:scale-[1.04] hover:bg-sp-green-hover',
   ghost: 'rounded-full px-6 py-3 bg-transparent text-white hover:scale-[1.04]',
}

export default function SecondaryButton({ styles, type, clickFun, id, children, variant = 'chip', active = false, className = '', ...props}) {
   const look = active ? 'rounded-full px-3 py-1.5 bg-white text-black' : VARIANTS[variant]
   return (
      <button
         {...props}
         onClick={clickFun}
         className={`text-sm font-bold mr-2 w-auto cursor-pointer transition-all duration-150 ${look} ${className}`}
         id={id}
         type={type}
      >
         {children}
      </button>
   )
}
