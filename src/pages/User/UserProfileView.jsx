import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Typography } from "@material-tailwind/react";
import defaultAvatar from '../../assets/user_img.png';
import { Pagination } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import {
    faBook,
    faCheck,
    faClock,
    faLink,
    faLocationDot,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { apiUserDetail } from '../../apis/user';
import { apiGetCourse } from '../../apis/course';
import HomeCard from '../../components/Card/HomeCard';
import counter_1 from '../../assets/counter-1.svg';
import counter_2 from '../../assets/counter-2.svg';
import counter_3 from '../../assets/counter-3.svg';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import SpinnerCustom from '../../components/Spinner/SpinnerCustom';
const UserPrfileView = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [coursePage, setCoursePage] = useState(1);
    const { userId } = useParams();
    const [courseTotalPage, setCourseTotalPage] = useState(1);
    const [totalCourses, setTotalCourses] = useState(0);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const getUserInfor = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiUserDetail(userId);
            if (res.status === 1) {
                console.log(res.data);
                setUser(res.data);
                document.title = res.data.full_name;
                let roles = res.data.roles;
                roles = roles.filter(role => role !== "ROLE_MANAGER").sort();
                setUserRole(roles);
            } else {
                console.log(res);
                setIsError(true);
            }
        } catch (err) {
            setIsError(true);
            console.log(err);
        }
        setLoading(false);
    }
    const getUserCourses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // const params = {
            //     search_type: "OFFICIAL",
            //     created_by: user?.id,
            //     max_result: "6",
            //     is_deleted: false,
            //     build_child: false,
            //     page: coursePage,
            // };
            const paramsAPI = new URLSearchParams();
            paramsAPI.append('created_by', user?.id);
            paramsAPI.append('build_child', false);
            paramsAPI.append('max_result', 20);
            paramsAPI.append('current_page', coursePage);
            paramsAPI.append('search_type', 'OFFICIAL');
            paramsAPI.append('is_deleted', false);

            paramsAPI.append('search_type', 'CHANGE_PRICE');
            const response = await apiGetCourse(paramsAPI);
            if (response.data && response.data.data && response.data.data?.length > 0) {
                setMyCourses(response.data.data);
                setTotalCourses(response.data.total);
                setCourseTotalPage(response.data.total_page);
            }
        } catch (error) {
            console.log(err);
        }
        setLoading(false);
    }
    useEffect(() => {
        document.title = "Thông tin";
        getUserInfor();
    }, [userId]);
    const handleChangePage = (event, value) => {
        setCoursePage(value);
    };
    useEffect(() => {
        getUserCourses();
    }, [user, coursePage]);
    return (
        // <>
        //     {loading ? (
        //         <div className=' flex justify-center h-full my-[8rem] items-center'>
        //             <Spinner className='w-20 h-auto' color="teal" />
        //         </div>
        //     ) : (isError ? (
        //         <div className='mt-[24px] w-full h-full'>
        //             <Typography className='flex justify-center text-[3.2rem]'>
        //                 Đã xảy ra lỗi
        //             </Typography>
        //         </div>
        //     ) : (
        //         <div className='relative w-full h-full my-[4.8rem] max-w-[71.2rem] mx-auto mr-auto ml-auto px-[2.4rem]'>
        //             <img src={user?.avatar ? user?.avatar : defaultAvatar} width={200} height={200} className='md:absolute md:top-0 md:right-[2.4rem] rounded-full object-cover aspect-[200/200]' //>
        //             <div className='pb-[2.4rem] md:max-w-[calc(100%-15rem)] md:pr-[6.4rem]'>
        //                 <div className='md:pt-0 text-[#6a6f73] uppercase pt-[3.2rem] text-[16px] font-bold leading-[1.2]'>
        //                     {userRole.map((role, index) => (
        //                         <span key={index} className='capitalize'>
        //                             {role === "ROLE_ADMIN" && 'Quản trị viên'}
        //                             {role === "ROLE_LECTURE" && 'Giảng viên'}
        //                             {role === "ROLE_USER" && 'Học viên'}
        //                             {/* {role === "ROLE_MANAGER" && 'Quản lý'} */}
        //                             {index < userRole.length - 1 ? '  |  ' : ''}
        //                         </span>
        //                     ))
        //                     }
        //                     {/* Giảng viên | Học Viên */}
        //                 </div>
        //                 <div className='  text-[2rem] font-bold max-w-[36rem] ' autoCapitalize='words'>{user?.full_name}</div>
        //                 <div className='py-[8px]  text-[1rem] font-bold max-w-[36rem]'>{user?.specialization}</div>
        //                 <div className='py-[8px]  text-[1rem] font-bold max-w-[36rem]'>{user?.email}</div>
        //                 <div className='pb-[8px]'></div>
        //                 <div className='flex mt-[16px]'>
        //                     <div>
        //                         <div className='text-[#6a6f73] min-w-[105px] mb-[8px] text-[16px] font-bold'>Tổng học viên</div>
        //                         <div className='font-bold max-w-[36rem] text-[24px]'>{user?.total_subscriptions.toLocaleString()}</div>
        //                     </div>
        //                     <div className='ml-[24px]'>
        //                         <div className='text-[#6a6f73] min-w-[105px] mb-[8px] text-[16px] font-bold'>Khóa học</div>
        //                         <div className='font-bold max-w-[36rem] text-[24px]'>{totalCourses.toLocaleString()}</div>
        //                     </div>
        //                     <div className='ml-[24px]'>
        //                         <div className='text-[#6a6f73] min-w-[105px] mb-[8px] text-[16px] font-bold'>Đánh giá</div>
        //                         <div className='font-bold max-w-[36rem] text-[24px]'>{user?.average_rating.toFixed(1)}</div>
        //                     </div>
        //                 </div>

        //                 <div className='pt-[48px] pb-[16px] text-[22px] font-bold max-w-[36rem] '>Địa chỉ</div>
        //                 <div>{user?.address}</div>
        //                 <h2 className='pt-[48px] pb-[16px] text-[22px] font-bold max-w-[36rem] '>Giới thiệu</h2>
        //                 <div className={`prose w-full min-h-[200px]`} dangerouslySetInnerHTML={{
        //                     __html: `${user?.description || `Chưa thêm mô tả`}`
        //                 }} />
        //                 {/* <div className='' dangerouslySetInnerHTML={{
        //                     __html: `${user?.description || ``}`
        //                 }} /> */}
        //                 {/* <div>
        //                     I have been working with Cloud (main AWS) since 2015 and 5 year working and living in Japan.

        //                     Language: Japanese (Business Intermediate level), English (Intermediate).

        //                     Certificates: AWS Certified Solution Architect Professional (since 2018, re-new 2023).

        //                     Other: AWS Community Builder (since 2023).

        //                     As a Cloud Solution Architect (SA), I can provide solutions for customer during system design, development and deployment. I also contribute to community by many activities like Youtube channel, on-demand private training course and now on Udemy. Nice to make friend with all of you.
        //                 </div> */}
        //             </div>

        //             <div className='md:max-w-[calc(100%-15rem)] md:pr-[6.4rem]'>
        //                 <div className='max-w-[60rem] pb-[3.2rem] relative'>
        //                     <h2 className=' pb-[16px] text-[22px] font-bold max-w-[36rem] '>Khóa học {`(${totalCourses.toLocaleString()})`}</h2>
        //                     <div className='md:grid  lg:grid-cols-3 md:grid-cols-2 gap-4'>
        //                         {myCourses.map((course, index) => (
        //                             <div className='pb-[16px]'>
        //                                 <HomeCard key={index} content={course} />
        //                             </div>
        //                         ))}
        //                     </div>
        //                 </div>
        //                 {courseTotalPage > 1 && (
        //                     <div className='flex list-none justify-center mb-[40px] pb-[40px]'>
        //                         <Pagination size='large' className='text-xl' page={coursePage} onChange={handleChangePage} count={courseTotalPage} showFirstButton showLastButton />
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //     ))}
        // </>

        <>
            {loading ? (
                <SpinnerCustom />
            ) : null}
            <div class="section-padding bg-[url('../assets/insbg.png')] bg-contain   bg-no-repeat">
                <div class="container">
                    <div class="grid grid-cols-12 xl:gap-0 gap-[30px]">
                        <div class="lg:col-span-4 col-span-12 ">
                            <div class="bg-white shadow-box7 rounded-md max-w-[350px] lg:sticky lg:top-10">
                                <div class="h-[300px] mb-8">
                                    <img src={user?.avatar ? user?.avatar : defaultAvatar} alt="" class="w-full h-full block object-contain rounded-t-md" />
                                </div>
                                <div class="px-8 pb-8">
                                    <h5 class=" text-2xl font-bold text-black mb-4">{user?.full_name}</h5>

                                    <ul class=" space-y-[19px]">
                                        <li class=" flex items-center space-x-3">
                                            <div class="flex-none">
                                                <span class="w-8 h-8 rounded bg-[#30bead] text-white flex flex-col items-center justify-center text-lg">
                                                    {/* <iconify-icon icon="heroicons:envelope"></iconify-icon> */}
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </span>
                                            </div>
                                            <span class=" flex-1">{user?.email}</span>
                                        </li>
                                        {user?.phone_number && (
                                            <li class=" flex items-center space-x-3">
                                                <div class="flex-none">
                                                    <span class="w-8 h-8 rounded bg-[#30bead] text-white flex flex-col items-center justify-center text-lg">
                                                        {/* <iconify-icon icon="heroicons:phone"></iconify-icon> */}
                                                        <FontAwesomeIcon icon={faPhone} />
                                                    </span>
                                                </div>
                                                <span class=" flex-1">{user?.phone_number}</span>
                                            </li>
                                        )}
                                        {user?.address && (
                                            <li class=" flex items-center space-x-3">
                                                <div class="flex-none">
                                                    <span class="w-8 h-8 rounded bg-[#30bead] text-white flex flex-col items-center justify-center text-lg">
                                                        {/* <iconify-icon icon="heroicons:map-pin"></iconify-icon> */}
                                                        <FontAwesomeIcon icon={faLocationDot} />
                                                    </span>
                                                </div>
                                                <span class=" flex-1">{user?.address}</span>
                                            </li>
                                        )}
                                    </ul>
                                    <div class=" text-xl flex items-center text-black mt-8 mb-4 gap-x-4">
                                        <Typography className='font-bold'>
                                            Theo dõi tôi tại
                                        </Typography>
                                        <a class="w-8 h-8 rounded hover:bg-[rgba(48,190,173,0.58)] cursor-pointer bg-[#30bead] text-white flex flex-col items-center justify-center text-lg">
                                            <FontAwesomeIcon icon={faLink} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="lg:col-span-8 col-span-12 lg:ml-10 ">
                            <div class="mb-10">
                                <h2 className='text-[44px] font-bold '>{user?.full_name}</h2>
                                <span class=" inline-block text-primary text-opacity-100">{user?.specialization}</span>
                                <div class=" grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[30px] mt-14">
                                    <div class="bg-white shadow-box7 text-center pt-[64px] pb-8 px-[50px]  rounded-[8px] relative my-4">
                                        <img src={counter_1} alt="" class=" absolute left-1/2 -translate-x-1/2 -top-10" />
                                        <h4 class=" text-[44px] leading-[66px] text-black font-bold mb-1 ">
                                            <span class="counter">
                                                {user?.total_subscriptions.toLocaleString()}
                                            </span>
                                        </h4>
                                        <Typography className='font-normal'>Lượt đăng ký</Typography>
                                    </div>
                                    <div class="bg-white shadow-box7 text-center pt-[64px] pb-8 px-[50px]  rounded-[8px] relative my-4">
                                        <img src={counter_2} alt="" class=" absolute left-1/2 -translate-x-1/2 -top-10" />
                                        <h4 class=" text-[44px] leading-[66px] text-black font-bold mb-1 ">
                                            <span class="counter">
                                                {totalCourses.toLocaleString()}
                                            </span>
                                        </h4>
                                        <Typography className='font-normal'>Khóa học</Typography>
                                    </div>
                                    <div class="bg-white shadow-box7 text-center pt-[64px] pb-8 px-[50px]  rounded-[8px] relative my-4">
                                        <img src={counter_3} alt="" class=" absolute left-1/2 -translate-x-1/2 -top-10" />
                                        <h4 class=" text-[44px] leading-[66px] text-black font-bold mb-1 ">
                                            <span class="counter">
                                                {user?.average_rating.toFixed(1)}
                                            </span>
                                        </h4>
                                        <Typography className='font-normal'>Đánh giá</Typography>
                                    </div>
                                </div>
                            </div>

                            <Typography className='font-normal prose'>
                                <div className='' dangerouslySetInnerHTML={{
                                    __html: `${user?.description || ``}`
                                }} />
                            </Typography>

                            {myCourses.length > 0 && (
                                <>
                                    <div class="mt-20 mb-14">
                                        <div class="mini-title prose">Khóa học của {user?.full_name}</div>
                                    </div>
                                    <div class=" grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 grid-cols-1  gap-[30px]">
                                        {myCourses.map((course, index) => (
                                            <HomeCard key={index} content={course} />
                                        ))}
                                    </div>
                                    <div class="text-center lg:pt-14 pt-8">
                                        {courseTotalPage > 1 && (
                                            <div className='flex list-none justify-center mb-[40px] pb-[40px]'>
                                                <Pagination size='large' className='text-xl' page={coursePage} onChange={handleChangePage} count={courseTotalPage} showFirstButton showLastButton />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPrfileView;