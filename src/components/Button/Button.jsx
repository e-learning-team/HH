import { memo } from 'react'
import clsx from 'clsx'
const Button = ({ label, handleOnClick, style, type = 'button', buttonAdmin }) => {
  return (
    <button
     type={type}
     className={clsx('inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset', buttonAdmin && 'flex justify-end  ml-10 my-5', style)}
     onClick={()=>{handleOnClick && handleOnClick()}}
    >
     {label}   
    </button>
  )
}

export default memo(Button)