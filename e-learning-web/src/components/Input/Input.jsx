import React,{useState} from 'react'
import clsx from 'clsx'
import {icon}  from '../../utils/icons'
const {BsSearch}=icon


const Input = ({value,setValue,nameKey, type, invalidFields, setInvalidFieds, style,fullWidth,placeholder,search}) => {
  
    return (
        <div className={clsx('w-full relative mb-2 border border-gray-500  ',fullWidth && 'w-full',search && 'w-80')}>
            <input
                prefix={icon &&  <BsSearch size={18} color='gray'/>}
                type={type||'text'}
                className={clsx('px-4 py-2 rounded-sm border  w-full focus:invalid:border-pink-300',style)}
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