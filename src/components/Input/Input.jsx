import React,{useState} from 'react'
import clsx from 'clsx'


const Input = ({value,setValue,nameKey, type, invalidFields, setInvalidFieds, style ,fullWidth,placeholder, disable}) => {
    return (
        <div className={clsx('w-full',fullWidth && 'w-full')}>
            <input
                type={type||'text'}
                disabled={disable}
                className={clsx(style, disable &&"cursor-no-drop", type==="number" &&"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")}
                placeholder={placeholder || nameKey?.slice(0,1).toUpperCase()+nameKey?.slice(1)}
                value={value}
                onChange={e=>setValue(prev=>({...prev,[nameKey]:e.target.value}))}
                onFocus={()=> setInvalidFieds && setInvalidFieds([])}
            />
           {invalidFields?.some(el=>el.name===nameKey) &&  
           
           <small className='text-main text-[14px] italic flex justify-start'>{invalidFields.find(el=>el.name===nameKey)?.mes}</small>}
        </div>
      )
}

export default Input