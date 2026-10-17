import React from 'react'

export default function Container({children}) {
  return (
     <div className='sp-main sp-scroll h-full overflow-y-auto rounded-lg px-4 py-6 md:px-6'>{children}</div>
  )
}
