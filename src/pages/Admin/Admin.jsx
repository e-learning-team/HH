import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ProfileMenu } from '../../components/ProfileMenu/ProfileMenu';
import { useDispatch, useSelector } from 'react-redux';
import Path from '../../utils/path';
import { toast } from 'react-toastify';
import { apiLogOut, apiUserDetail } from '../../apis/user';
import { logout, updateUser } from '../../store/User/userSlice';
import { AdminSidebar } from '../../components/Navbar/AdminSidebar';
const Admin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isHover, setIsHover] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    const handleHover = (hover) => {
        setIsHover(hover);
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
    const getUserDetail = async () => {
        setLoading(true);
        const res = await apiUserDetail(userData?.id);
        if (res?.data) {
            dispatch(updateUser({
                userData: res.data
            }));
        }
        // console.log(res?.data);
        setLoading(false);
    };
    useEffect(() => {
        if (isLoggedIn) {
            getUserDetail();
            if (userData.roles.includes("ROLE_ADMIN")) {
                const currentPath = window.location.pathname.normalize();
                if (currentPath === `${Path.ADMIN_P.trim()}` || currentPath === `/admin`) {
                    navigate(Path.ADMIN_P + Path.ADMIN_USER);
                }
            }
        } else {
            navigate(`/${Path.LOGIN}`);
            toast.warning("Hãy đăng nhập trước");
        }

    }, []);
    useEffect(() => {
        // if (isLoggedIn) {
        //     getUserDetail();
        // }
        // console.log('---lecturer change---')
    }, [userData]);
    return (
        <>
            {isLoggedIn && userData.roles.includes("ROLE_LECTURE") && (
                <div className="flex  w-full">
                    <AdminSidebar className='' handleHover={handleHover} />
                    <div className={`w-full duration-500  ml-20 ${isHover && 'ml-[13rem]'}`}>
                    {/* <div className={` w-full duration-500  ml-20 `}> */}
                        <div className='flex w-full shadow-sm py-2 pr-8 justify-end '>
                            <div className='flex justify-center gap-x-3 items-center'>
                                <NavLink to={`/${Path.HOME}`}>
                                    <div className='h-full hover:underline cursor-pointer py-5 px-2'>
                                        <div className='text-gray-800 font-normal '>
                                            Học viên
                                        </div>
                                    </div>
                                </NavLink>
                                <ProfileMenu handleLogout={handleLogout} />
                            </div>
                        </div>
                        <div className={`flex-1 min-h-[500px] mx-8 mt-3`}>
                            <div>
                                <Outlet context={{ isLoggedIn, avatarURL, userData, token, isLoading, message }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Admin