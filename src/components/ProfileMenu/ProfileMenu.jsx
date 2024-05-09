import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import Path from "../../utils/path";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

export function ProfileMenu({ handleLogout }) {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    
    return (
        <Menu className=''>
            <MenuHandler className='!max-w-[50px] !max-h-[50px] !h-[50px] !w-[50px]  rounded-[50%] overflow-hidden cursor-pointer shadow-lg'>
                <Avatar
                    variant="rounded"
                    alt={userData.full_name}
                    title={userData.full_name}
                    className=""
                    src={avatarURL}
                />
            </MenuHandler>
            <MenuList className="z-50 min-w-[270px] max-w-[320px] w-auto shadow-lg ml-[-1rem]">
                <NavLink to={Path.USER_P + Path.USER_PROFILE} className="w-auto group/item !outline-none">
                    <MenuItem className={clsx('flex items-center gap-2 h-20')}>
                        <img src={avatarURL} className="h-20 !max-w-[80px] !max-h-[80px] w-20 object-cover !rounded-[50%]" />
                        <div className="flex flex-col h-full justify-start">
                            <p className="text-left text-lg max-w-[180px] group-hover/item:underline group-hover/item:text-[#003a47] line-clamp-2  font-medium "
                                title={userData.full_name} >
                                {userData.full_name}
                            </p>
                            <p className="text-left max-w-[180px] truncate font-light"
                                title={userData.email} >
                                {userData.email}
                            </p>
                        </div>
                    </MenuItem>
                </NavLink>

                <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />

                <NavLink to={Path.USER_P + Path.USER_ENROLLMENT} className={"hover:underline  !outline-none"}>
                    <MenuItem className="flex items-center gap-2 pt-2">
                        <Typography variant="small" className="font-medium">
                            Khóa học đã đăng kí
                        </Typography>
                    </MenuItem>
                </NavLink>

                {/* <NavLink to={Path.USER_PROFILE} className={"hover:underline  !outline-none"}>
                    <MenuItem className="flex items-center gap-2 pt-2">
                        <Typography variant="small" className="font-medium">
                            Khóa học đã đăng
                        </Typography>
                    </MenuItem>
                </NavLink> */}
                <NavLink to={Path.USER_P + Path.USER_BOOKMARK} className={"hover:underline  !outline-none"}>
                    <MenuItem className="flex items-center gap-2 pt-2">
                        <Typography variant="small" className="font-medium">
                            Khóa học đã lưu
                        </Typography>
                    </MenuItem>
                </NavLink>
                <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />
                <NavLink to={Path.USER_P + Path.USER_HISTORY} className={"hover:underline  !outline-none"}>
                    <MenuItem className="flex items-center gap-2 pt-2">
                        <Typography variant="small" className="font-medium">
                            Lịch sử thanh toán
                        </Typography>
                    </MenuItem>
                </NavLink>
                {/* <NavLink to={Path.USER_PROFILE} className={"hover:underline  !outline-none"}>
                    <MenuItem className="flex items-center gap-2 pt-2">
                        <Typography variant="small" className="font-medium">
                            Phương thức thanh toán
                        </Typography>
                    </MenuItem>
                </NavLink> */}
                <hr className="relative left-0 right-0 my-2 border-black-200 focus-v !outline-none " />
                <MenuItem onClick={() => handleLogout()} className="flex items-center bg-[#f0f2f4] hover:bg-[#003a47] hover:text-white pb-0 py-2">
                    <Typography variant="small" className="font-medium ">
                        Đăng xuất
                    </Typography>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}