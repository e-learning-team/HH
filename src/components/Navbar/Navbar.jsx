import React, { useState } from 'react';
import logo from '../../assets/logo-side.svg';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Path from '../../utils/path';
import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import { apiLogOut } from '../../apis/user';
// import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';
import { logout } from '../../store/User/userSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    // useEffect(() => {
    //     document.title = 'Đăng nhập';
    //     if (isLoggedIn && isLoggedIn == true) {
    //         navigate(`/${Path.HOME}`);
    //     }
    // }, []);
    const handleLogout = (() => {
        console.log("logout")
        apiLogOut().then(() => {
            // dispatch(logout());
            navigate(`/${Path.HOME}`);
            toast.success(`Đăng xuất thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        );
        // if (rs.status === 1) {
        //     dispatch(login({
        //         isLoggedIn: true,
        //         userData: rs.data.user,
        //         token: rs.data.token,
        //     }));

        // } else toast.error(rs.message, {
        //     position: toast.POSITION.TOP_RIGHT,
        // });

    });
    return (
        <div className='w-main flex items-center gap-5  shadow-lg transition bg-white justify-between px-[20px]'>
            <div className="flex items-center flex-1">
                <div className='px-7 py-5 flex justify-center'>
                    <NavLink to={Path.HOME}>
                        <img src={logo} className='w-[91px] h-[35px]' />
                    </NavLink>

                </div>
                <div className='px-7 py-5 font-semibold mr-[25px] relative text-center'>
                    Danh mục
                    {/* <div className=' absolute top-[4.3rem] min-h-[20rem] min-w-[10rem] shadow-lg'>
                        <div className='absolute w-[10rem] h-[20px] top-[-1rem] right-0'></div>
                        <ul>
                            <li className='px-5 py-2'>
                                c-1
                            </li>
                            <li className='px-5 py-2'>
                                c-2
                            </li>
                            <li className='px-5 py-2'>
                                c-3
                            </li>
                            <li className='px-5 py-2'>
                                c-4
                            </li>
                            <li className='px-5 py-2'>
                                c-5
                            </li>
                        </ul>
                    </div> */}
                </div>
                <div className='flex items-center w-1/2'>
                    <Input style="rounded-[50px] border-[#003a47] px-4 py-2 border w-full" placeholder='Tìm kiếm khoá học' className='focus:none' />
                </div>
            </div>
            <div className="flex items-center flex-2">
                <div>
                    <div className='text-gray-800 font-semibold '>
                        Giảng dạy trên Wisdom
                    </div>
                </div>
                <div className={clsx('flex justify-center items-center gap-5 ml-[10px]')}>
                    {isLoggedIn ? (
                        <NavLink>
                            <Button type="button" handleOnClick={handleLogout}  children="Đăng xuất" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng xuất" severity="secondary" outlined />
                        </NavLink>
                    ) : (
                        <>
                            <NavLink to={Path.LOGIN}>
                                <Button type="button" children="Đăng nhập" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng nhập" severity="secondary" outlined />
                            </NavLink>

                            <NavLink to={Path.REGISTER}>
                                <Button children="Đăng ký" style="bg-[#29abe2] w-[100px] h-[40px] ring-gray-300 hover:bg-[#088ab7] text-white" label="Đăng ký" severity="info" rounded />
                            </NavLink>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Navbar;