import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo-side.svg';
import Button from '../Button/Button';
import Path from '../../utils/path';
import { useNavigate, useSearchParams } from "react-router-dom";
import Dropdown from 'react-multilevel-dropdown';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import { apiLogOut } from '../../apis/user';
// import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';
import { logout } from '../../store/User/userSlice';
import { toast } from 'react-toastify';
import { apiCategory } from '../../apis/category';
import { ProfileMenu } from '../ProfileMenu/ProfileMenu';
import { useLocation } from 'react-router-dom';
//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLanguage,
    faBars,
} from '@fortawesome/free-solid-svg-icons';
//css
import '../../styles/navbar.css';
const Navbar = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [category, setCategory] = useState([]);
    const [payload, setPayload] = useState({
        keyword: "",
    });

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            const trimmedKeyword = payload.keyword.trim();
            const params = new URLSearchParams(window.location.search);
            params.set('keyword', trimmedKeyword);
            if (!payload.keyword) {
                params.delete('keyword');
                params.delete('category');
                params.delete('subcategory');
            } else {
                setPayload({ keyword: trimmedKeyword });
            }

            const newPath = `${Path.COURSES_CATEGORY}?${params.toString()}`;
            navigate(newPath);
        }
    };
    const handleCategory = (category) => {
        const params = new URLSearchParams(window.location.search);
        params.delete('subcategory');
        params.set('category', category.id);
        if (params.get('keyword')) {
            setPayload({ keyword: '' });
            params.delete('keyword');
        }
        const newPath = `${Path.COURSES_CATEGORY}?${params.toString()}`;
        navigate(newPath);
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const keywordParam = urlParams.get('keyword');

        if (keywordParam !== null) {
            setPayload({ keyword: keywordParam });
        }
    }, []);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoryData = await apiCategory({ build_type: 'TREE' });
                setCategory(categoryData.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategory();
    }, []);

    const renderCategory = (category) => {
        return (
            <Dropdown.Item key={category.id} position='right'>
                {
                    <span onClick={() => handleCategory(category)} classNameName='flex justify-between w-full'>
                        <span>
                            {category.title}
                        </span>
                        {category.children.length > 0 && (<span>{'>'}</span>)}
                    </span>

                }
                {category.children.length > 0 && (
                    <Dropdown.Submenu position='right'>
                        {category.children.map((child) => renderCategory(child))}
                    </Dropdown.Submenu>
                )}
            </Dropdown.Item>
        );
    };
    const handleLogout = async () => {
        console.log("logout");
        try {
            await apiLogOut();
            navigate(`/${Path.HOME}`);
            dispatch(logout());
            toast.success(`Đăng xuất thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            console.error("Logout failed:", error);
            // Handle logout failure if needed
        }
    };
    return (
        // <div className='fixed z-50'>
        //     <div className='w-main  flex items-center gap-5  shadow-lg transition bg-white justify-between px-[20px]'>
        //         <div className="flex items-center flex-1">
        //             <div className='px-7 py-2 flex justify-center'>
        //                 <NavLink to={Path.HOME}>
        //                     <img src={logo} className='w-[91px] h-[35px]' />
        //                 </NavLink>

        //             </div>
        //             <div className='px-7 py-5 font-semibold mr-[25px] relative text-center'>
        //                 <Dropdown title='Danh mục' openOnHover={true} position='right'>
        //                     {category.map((category) => renderCategory(category))}
        //                 </Dropdown>
        //             </div>
        //             <div className='flex items-center w-1/2'>
        //                 <input
        //                     type="text"
        //                     value={payload.keyword}
        //                     className='rounded-[50px] border-[#003a47] px-4 py-2 border w-full'
        //                     onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))}
        //                     onKeyDown={(e) => handleEnter(e)}
        //                 />
        //             </div>
        //         </div>
        //         <div className="flex h-full items-center gap-6  flex-2">
        //             <NavLink to={Path.LECTURER_P}>
        //                 <div className='h-full hover:underline cursor-pointer py-5 px-2'>
        //                     <div className='text-gray-800 font-semibold '>
        //                         Giảng dạy trên Wisdom
        //                     </div>
        //                 </div>
        //             </NavLink>
        //             <div className={clsx('flex justify-center items-center gap-5 ml-[10px]  mr-4')}>
        //                 {isLoggedIn ? (
        //                     <div className=''>
        //                         <ProfileMenu handleLogout={() => handleLogout()} />
        //                     </div>
        //                 ) : (
        //                     <>
        //                         <NavLink to={Path.LOGIN}>
        //                             <Button type="button" children="Đăng nhập" style="bg-white w-[100px] h-[40px] ring-gray-300 hover:bg-gray-100" label="Đăng nhập" severity="secondary" outlined />
        //                         </NavLink>

        //                         <NavLink to={Path.REGISTER}>
        //                             <Button children="Đăng ký" style="bg-[#29abe2] w-[100px] h-[40px] ring-gray-300 hover:bg-[#088ab7] text-white" label="Đăng ký" severity="info" rounded />
        //                         </NavLink>
        //                     </>
        //                 )}

        //             </div>

        //         </div>
        //     </div>
        // </div>

        <header className="sticky z-30 md:z-40 top-0 bg-white shadow-2xl">
            <div className="hidden md:block">
                <div className="py-4 px-6">
                    <div className="flex flex-row">
                        <div className="2xl:basis-7/12 lg:basis-6/12 basis-7/12 flex xl:gap-8 w-auto items-center gap-4">
                            <NavLink to={Path.HOME}>
                                <img src={logo} className='h-[45px]' />
                            </NavLink>
                            <div className="wisdom-menu-cate my-auto">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3.5H3V10.5H10V3.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M21 3.5H14V10.5H21V3.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M21 14.5H14V21.5H21V14.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M10 14.5H3V21.5H10V14.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                                <nav id="mysidebarmenu" className="amazonmenu">
                                    <ul>
                                        {category.map((level1) =>
                                        (
                                            <li className="hassub group/item">
                                                <a title={level1.title} href="/course/ngoai-ngu" className={clsx((level1.children.length > 0) && "after:@apply after:content-[''] after:h-0 after:absolute after:w-0 after:border-l-[gray] after:border-[5px] after:border-solid after:border-transparent after:right-[5px] after:top-[35%]")}>
                                                    {level1.title}
                                                </a>
                                                {level1.children.length > 0 && (
                                                    <ul class="issub" className={clsx('index-[1006] none group-hover/item:block group/child')}>
                                                        {level1.children.map((level2) => (
                                                            <li className="group/item2">
                                                                <a href="/course/ngoai-ngu" className={clsx((level2.children.length > 0) && "after:@apply after:content-[''] after:h-0 after:absolute after:w-0 after:border-l-[gray] after:border-[5px] after:border-solid after:border-transparent after:right-[5px] after:top-[35%]")}>
                                                                    {level2.title}
                                                                </a>
                                                                {level2.children.length > 0 && (
                                                                    <ul class="issub" className={clsx('index-[1007] none group-hover/item2:block')}>
                                                                        {level2.children.map((level3) => (
                                                                            <li>
                                                                                <a href="/course/ngoai-ngu">
                                                                                    {level3.title}
                                                                                </a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>

                            <div className="w-full">
                                <form className="relative" action="/courses/search">
                                    <input autocomplete="off"
                                        name="keyword"
                                        id="text_search"
                                        type="text"
                                        className="block w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-gray-500 focus:border-gray-500 ui-autocomplete-input"
                                        placeholder="Tìm kiếm nội dung bất kỳ"
                                        required=""
                                        value={payload.keyword}
                                        onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))} />
                                    <button type="submit" className="absolute top-0 right-0 h-full pr-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#929495" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M20.9999 21L16.6499 16.65" stroke="#929495" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="2xl:basis-5/12 lg:basis-6/12 basis-5/12 flex justify-end xl:gap-6 gap-4">
                            {isLoggedIn ? (<div className="my-auto lg:block sm:hidden">
                                <NavLink to={Path.LECTURER_P} className="block">
                                    Giảng dạy trên Wisdom
                                </NavLink>
                                {/* <a className="block" href="/biz">Doanh nghiệp</a> */}
                            </div>) : (<></>)}
                            <div className={clsx('flex justify-center items-center gap-5 ml-[10px]  mr-4')}>
                                {isLoggedIn ? (
                                    <div className=''>
                                        <ProfileMenu handleLogout={() => handleLogout()} />
                                    </div>
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
                </div>
            </div>
            {/* <!--Menu mobile--> */}
            <div className="lg:hidden md:hidden">
                <div className="grid grid-cols-3 px-4 py-3.5">
                    <button className="text-2xl flex align-items-center" type="button" data-drawer-target="drawer-left-navbar" data-drawer-show="drawer-left-navbar" data-drawer-placement="left" aria-controls="drawer-left-navbar">
                        {/* <i className="fa fa-bars" aria-hidden="true"></i> */}
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <NavLink to={Path.HOME}>
                        <img src={logo} className='h-[45px]' />
                    </NavLink>
                    {/* <div className="flex justify-end items-center gap-6">
                        <svg data-modal-target="search-modal" data-modal-toggle="search-modal" data-modal-placement="top" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M20.9999 21L16.6499 16.65" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <a href="/cart" className="relative">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </a>
                    </div> */}
                </div>
                <div className="mb-input-search hidden">
                    <div className="c_quick-search__form">
                        <form className="searchbox" method="GET" action="/search">
                            <input autocomplete="off" type="text" className="form-control sm-form" name="key" placeholder="Tìm khóa học, giảng viên" required="" />
                            <button type="submit" className="btn sm-btn-search"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;