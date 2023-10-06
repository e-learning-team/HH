import React,{useState} from 'react'
import clsx from 'clsx'


const Input = ({value,setValue,nameKey, type, invalidFields, setInvalidFieds, style ,fullWidth,placeholder,search}) => {
    const handleChange = (e) => {
        const {  value } = e.target
        console.log(value)
        console.log(nameKey)
        setValue(prev=>({...prev,[nameKey]:value}))
  }
    return (
        <div className={clsx('w-full',fullWidth && 'w-full',search && 'w-80')}>
            <input
                type={type||'text'}
                className={clsx(style)}
                placeholder={placeholder || nameKey?.slice(0,1).toUpperCase()+nameKey?.slice(1)}
                value={value}
                onChange={e=>setValue(prev=>({...prev,[nameKey]:e.target.value}))}
                // onChange={e => handleChange(e)}
                // onInput={e=>setValue(prev=>({...prev,[nameKey]:e.target.value}))}
                onFocus={()=> setInvalidFieds && setInvalidFieds([])}
            />
           {invalidFields?.some(el=>el.name===nameKey) &&  
           
           <small className='text-main text-[14px] italic flex justify-start'>{invalidFields.find(el=>el.name===nameKey)?.mes}</small>}
        </div>
      )
}

export default Input