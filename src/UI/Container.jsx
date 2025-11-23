import React from 'react'

export default function Container({children}) {
  return (
    // <div className='w-full mx-4 bg-main-bg-gray p-6 rounded-lg overflow-y-auto no-scrollbar'>{children}</div>
     <div className='h-full mx-4 p-6 rounded-lg bg-base-200'>{children}</div>
  )
}
