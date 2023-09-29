import React,{useState} from 'react'
import logo from '../../assets/logo.svg'
import Input from '../Input/input'
import {icon}  from '../../utils/icons'
import Button from '../Button/Button'
import Login from '../Login/Login'
import Path from '../../utils/path'
import { Link } from 'react-router-dom'


const {BsSearch}=icon


const Navbar = () => {


  return (
    <div className='w-main flex items-center gap-5 justify-around  shadow-lg transition'>
        <div className='px-7 py-5'>
            <img src={logo} className='w-[91px] h-[35px]'/>
        </div>
        <div className='text-gray-800 font-semibold '>
            Danh muc
        </div>
        <div className='flex items-center hover boder border-gray-600 focus:bg-gray-900/50'>
            <Input  placeholder='Search Here'className='focus:none' />
        </div>
        <div>
            <div className='text-gray-800 font-semibold '>
                Giang day tren udemy
            </div>
        </div>
        <div className='flex justify-center items-center gap-5'>
            <Link onClick={Path.LOGIN}>
            <Button children='Login' />
            </Link>
            <Button children='Register'/>
        </div>
    </div>
  )
}

export default Navbar