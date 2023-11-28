import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LectureSidebar } from '../../components/Navbar/LecturerSidebar';
import { Outlet } from 'react-router-dom';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';

const Lecturer = () => {
    const [isHover, setIsHover] = useState(false);
    const handleHover = (hover) => {
        setIsHover(hover);
    };
    return (
        <>
            <div className="flex  w-full">
                <LectureSidebar className='' handleHover={handleHover} />
                {/* <div className={`h-[999px] w-full duration-500  ml-20 ${isHover && 'ml-[13rem]'}`}> */}
                <div className={` w-full duration-500  ml-20 `}>
                    <div className='flex w-full shadow-sm py-2 pr-8 justify-end '>
                        <div className='flex justify-center gap-x-3 items-center'>
                            <div className='h-full hover:underline cursor-pointer py-5 px-2'>
                                <div className='text-gray-800 font-normal '>
                                    Học viên
                                </div>
                            </div>
                            <ProfileMenu />
                        </div>
                    </div>
                    <div className={`flex-1 min-h-[999px] mx-12 mt-3`}>
                        <div>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lecturer

