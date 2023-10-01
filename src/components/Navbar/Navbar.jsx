import React, { useState } from 'react'
import logo from '../../assets/logo.svg'
import Input from '../Input/Input'
import Button from '../Button/Button'
import Path from '../../utils/path'
import { Link } from 'react-router-dom'
// import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';


const Navbar = () => {


    return (
        <div className='w-main flex items-center gap-5  shadow-lg transition bg-white justify-between px-[20px]'>
            <div className="flex items-center flex-1 items-center">
                <div className='px-7 py-5 flex justify-center'>
                    <img src={logo} className='w-[91px] h-[35px]' />
                </div>
                <div className='font-semibold mr-[25px]'>
                    Danh mục
                </div>
                <div className='flex items-center w-1/2'>
                    <Input style="rounded-[50px] border-[#003a47] px-4 py-2 border w-full" placeholder='Tìm kiếm khoá học' className='focus:none' />
                </div>
            </div>
            <div className="flex items-center flex-2 items-center">
                <div>
                    <div className='text-gray-800 font-semibold '>
                        Giảng dạy trên Wisdom
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5 ml-[10px]'>
                    <NavLink to={Path.LOGIN}>
                        <Button type="button" handleOnClick children="Đăng nhập" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng nhập" severity="secondary" outlined />
                    </NavLink>

                    <NavLink to={Path.REGISTER}>
                        <Button children="Đăng ký" style="bg-[#29abe2] w-[100px] h-[40px] ring-gray-300 hover:bg-[#088ab7] text-white" label="Đăng ký" severity="info" rounded />
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar