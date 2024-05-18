import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, Typography } from "@material-tailwind/react";
import defaultAvatar from '../../assets/user_img.png';

import {
    faCirclePlay,
    faPenToSquare,
    faPersonChalkboard,
    faInfinity,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import {
    faBookmark,
    faFileAudio,

} from '@fortawesome/free-regular-svg-icons';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '../../components/Button/Button';
import { VideoReviewDialog } from '../../components/Dialog/VideoReviewDialog';
import { formatTimeStampTo_DDMMYYY, extractIdSlug } from '../../utils/helper';
import { apiGetCourse } from '../../apis/course';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { apiCheckEnrollment, apiSaveEnrollment } from '../../apis/enrollment';
import { apiGetPaymentUrl } from '../../apis/invoice';
import { coursePay } from '../../store/User/userSlice';
import noImg from '../../assets/no-image-icon.jpg';
import { apiGetComment } from '../../apis/comment';
import { Comments } from '../../components/Comments/Comments';
import { apiUserDetail } from '../../apis/user';
import SpinnerCustom from '../../components/Spinner/SpinnerCustom';

const CourseDeTail = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const { slug } = useParams();
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [totalRatings, setTotalRatings] = useState({});

    const [comment, setComment] = useState([]); // [{}]
    const [commentPage, setCommentPage] = useState(1); // [{}]
    const [commentLoading, setCommentLoading] = useState(false); // [{}]
    const [commentTotalPage, setCommentTotalPage] = useState(0); // [{
    const [commentTotalResult, setCommentTotalResult] = useState(0); // [{}
    // const [commentReload, setCommentReload] = useState(false); // [{}

    const [lecturer, setLecturer] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getCurrentCourse = async () => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.append('slug', slug);
            paramsAPI.append('build_child', true);
            paramsAPI.append('search_type', 'OFFICIAL');
            paramsAPI.append('search_type', 'CHANGE_PRICE');
            if (window.location.pathname.normalize().includes('admin') || window.location.pathname.normalize().includes('lecturer')) {
                paramsAPI.append('search_type', 'DRAFT');
                paramsAPI.append('search_type', 'WAITING');
            }

            const response = await apiGetCourse(paramsAPI);
            if (!response.data && !response.data && response.data.data?.length === 0 || response.data?.data[0]?.level != 1) {
                // toast.error("Đã xảy ra lỗi", {
                //     position: toast.POSITION.TOP_RIGHT,
                // });
                setIsError(true);
                return;
            }
            setCourse(response.data);
            setTotalRatings(response.data?.data[0]?.course_ratings);
            if (isLoggedIn) {
                checkEnroll(response.data?.data[0]?.id);
            }
            document.title = response.data?.data[0].name;
        } catch (error) {
            // toast.error("Đã xảy ra lỗi", {
            //     position: toast.POSITION.TOP_RIGHT,
            // });
            setIsError(true);
            console.error("Error fetching course data", error);
            // return
            // navigate(`/error`);
        } finally {
            setLoading(false);
        }
    };

    const getCourseComment = async () => {
        const param = {
            current_page: commentPage,
            reference_id: extractIdSlug(slug),
            max_result: 5
        }
        if (commentLoading) return;
        setCommentLoading(true);
        try {
            const response = await apiGetComment(param);
            if (response.status === 1 && response.data?.data) {
                // console.log("Comment", response.data.total_page);
                // console.log("Comment", commentPage);
                // console.log("Comment", commentPage < response.data.total_page);
                setCommentTotalPage(response.data.total_page);
                setCommentTotalResult(response.data.total_result);
                if (commentPage === 1)
                    setComment(response.data.data);
                else
                    setComment((prev) => [...prev, ...response.data.data]);
                // setComment(response.data.data);
            } else {
                toast.error(`${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error("Error fetching course comment", error);
        }
        setCommentLoading(false);
    }
    const handleEnroll = async () => {
        console.log("CLICK enroll");
        setLoading(true);
        if (!isLoggedIn || !userData) {
            toast.warning(`Vui lòng đăng nhập trước`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setLoading(false);
            return;
        }
        const data = {
            user_id: userData.id,
            course_id: extractIdSlug(slug),
        };
        //Kiểm tra nếu có giá tiền thì thanh toán trc khi enroll
        if (course.data[0]?.price_sell > 0) {
            const response = await apiGetPaymentUrl(data.course_id, data.user_id);
            if (response.status === 0) {
                toast.error(`${response.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } else {
                dispatch(coursePay({ course_payment: slug }));
                window.location.href = response;
                return;
            }
        }
        const res = await apiSaveEnrollment(data);
        if (res.status == 1) {
            toast.success(`Đăng kí thành công\nChuyển hướng đến trang học`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setIsEnrolled(true);
            navigate(`/courses/learn/${slug}`);
        } else {
            toast.error(`${res.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        setLoading(false);
    };
    const checkEnroll = async (course_id) => {
        const res = await apiCheckEnrollment(course_id);
        if (res && res.data) {
            setIsEnrolled(res.data);
        }
    };

    const getUserInfor = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await apiUserDetail(course.data[0].created_by);
            if (res.status === 1) {
                console.log(res.data);
                setLecturer(res.data);
                // let roles = res.data.roles;
                // roles = roles.filter(role => role !== "ROLE_MANAGER").sort();
                // setUserRole(roles);
            } else {
                // console.log(res);
                // setIsError(true);
            }
        } catch (err) {
            // setIsError(true);
            // console.log(err);
        }
        setLoading(false);
    }
    useEffect(() => {
        getCurrentCourse();
    }, [slug, isLoggedIn]);

    useEffect(() => {
        getUserInfor();
    }, [course])

    const handleReloadComment = async () => {
        await setComment([]);
        if (commentPage === 1) {
            await getCourseComment()
        } else {
            await setCommentPage(1)
        }
    }
    useEffect(() => {
        getCourseComment();
    }, [commentPage]);

    const [openVideoReviewDialog, setOpenVideoReviewDialog] = React.useState(false);
    const handleOpenVideoReviewDialog = () => setOpenVideoReviewDialog(!openVideoReviewDialog);
    return (
        <div className="bg-[url('../assets/insbg.png')]">
            {loading ? (
                <div className=' flex justify-center h-screen items-center'>
                    <SpinnerCustom />
                </div>
            ) : (isError ? (
                <div className=' absolute top-0 bottom-0 left-0 right-0 m-auto w-full h-full'>
                    <Typography className='flex justify-center'>
                        Đã xảy ra lỗi
                    </Typography>
                </div>
            ) : (
                <div>
                    <div className=' mb-[80px]'>
                        <div className='h-auto  bg-[#003a47]'>
                            <div className='my-0 mx-auto py-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                                <div className='max-w-[46rem]'>
                                    <div className=' text-white '>
                                        <div className=''>
                                            <h1 className='text-3xl font-bold  mb-4'>{course.data[0].name}</h1>
                                            <div className='text-1xl mb-4'>{course.data[0].short_description}</div>
                                            <div className='mb-2 flex gap-2 text-sm'>
                                                <RatingBar value={totalRatings.averageRate.toFixed(1)} totalReview={totalRatings.totalRatings} />
                                                <span>{course.data[0].subscriptions || 0} đã đăng kí.</span>
                                            </div>
                                            <div className='font-normal text-sm mb-2'>
                                                <span>
                                                    <FontAwesomeIcon icon={faPersonChalkboard} className='mr-1 text-[#faaf00]' />
                                                    Được tạo bởi:
                                                </span>
                                                <a href={`#lecturer-detail`} className='text-[#64ceeb] underline'> {course.data[0].created_user_info[course.data[0].created_by]}</a>
                                                {/* <NavLink to={`/profile/${course.data[0].created_by}`} className='text-[#64ceeb] underline'> {course.data[0].created_user_info[course.data[0].created_by]}</NavLink> */}
                                            </div>
                                            <div className='font-normal text-sm mb-2'>
                                                <span>
                                                    <FontAwesomeIcon icon={faPenToSquare} className='mr-1 text-[#faaf00]' />
                                                    Cập nhật gần nhất:
                                                </span>
                                                <span className='text-[#64ceeb]'> {formatTimeStampTo_DDMMYYY(course.data[0].update_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='my-0 mx-auto max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6 '>
                            <div className='shadow-lg  !bg-none rounded-lg transition border-solid border bg-[#003a47] stroke-white lg:w-[22rem] lg:absolute sm:relative lg:ml-[50rem] sm:ml-0 lg:top-28'>
                                <div className='w-full rounded-lg overflow-hidden'>
                                    <div >
                                        <div className='relative border-solid border-b stroke-white'>
                                            <span onClick={handleOpenVideoReviewDialog} className='cursor-pointer absolute z-10 flex  justify-center items-center mx-auto my-0 w-full h-full'>
                                                <FontAwesomeIcon className='h-20 text-white border-solid border-b-2 stroke-white rounded-full bg-[#003a47]' icon={faCirclePlay} />
                                                <span className='absolute z-20 bottom-4 w-full flex justify-center items-center text-white font-bold'>
                                                    Xem trước khóa học
                                                </span>
                                            </span>

                                            <span className='absolute h-full w-full bg-gradient-to-b from-transparent to-black  '>
                                            </span>

                                            <img className='h-full w-full bg-cover object-contain' src={course.data[0].image_path
                                                ? course.data[0].image_path
                                                : noImg} />
                                        </div>
                                    </div>
                                    <div className='p-6  bg-white rounded-b-lg'>
                                        <div className=' mb-6 text-[#003a47] text-[2.2rem]'>
                                            <span className='font-mono font-semibold'>{course.data[0].price_sell ? course.data[0].price_sell.toLocaleString() + "₫" : (<>Miễn phí</>)}</span>
                                        </div>
                                        <div className='mb-6 flex gap-2'>
                                            {(isEnrolled && !(userData.roles.includes("ROLE_ADMIN"))) ? (
                                                <NavLink to={`/courses/learn/${slug}`} className="flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm ring-1 ring-inset bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white">Học ngay</NavLink>
                                            ) : (
                                                <>
                                                    {(course.data[0].created_by === userData?.id || (userData.roles.includes("ROLE_ADMIN"))) ? (
                                                        <>
                                                            <NavLink to={`/lecturer/courses/learn/${slug}/preview`} className="flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm ring-1 ring-inset bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white">Xem ngay</NavLink>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button handleOnClick={handleEnroll} style="flex-1 bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white" label="Đăng kí học" severity="info" rounded />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <Button style="w-[60px] h-[60px] shadow-lg bg-white ring-gray-300 hover:bg-gray-100" label={<FontAwesomeIcon icon={faBookmark} />} severity="info" rounded />
                                        </div>

                                        <div className='mb-6 '>
                                            <div>
                                                <h2 className='font-bold mb-2'>Khóa học này bao gồm:</h2>
                                                <div>
                                                    <ul>
                                                        <li className='flex items-center '>
                                                            <FontAwesomeIcon icon={faFileAudio} className='w-[2rem]' />
                                                            <span className='ml-1'>Khóa học uy tín</span>
                                                        </li>
                                                        <li className='flex items-center '>
                                                            <FontAwesomeIcon icon={faInfinity} className='w-[2rem]' />
                                                            <span className='ml-1'>Truy cập trọn đời</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Button style="w-full h-[60px] shadow-lg bg-white ring-gray-300 hover:bg-gray-100" label={'Chia sẻ'} severity="info" rounded />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='my-0 mx-auto py-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                            <div className='max-w-[46rem] '>
                                <h1 className='font-bold text-2xl'>
                                    TÓM TẮT
                                </h1>
                            </div>
                            <div className='mt-4 max-w-[46rem]'>
                                <div>
                                    <div className='prose' dangerouslySetInnerHTML={{
                                        __html: `${course.data[0].description || `Không có mô tả`}`
                                    }} />
                                    {/* <span>
                                        {course.description}
                                    </span> */}
                                </div>
                            </div>
                        </div>
                        <div className='my-0 mx-auto pb-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                            <div className='max-w-[46rem] justify-between flex'>
                                <h1 className='font-bold text-2xl'>
                                    NỘI DUNG KHÓA HỌC
                                </h1>
                                {/* <a className="flex items-center text-sm" href="/course/learn/">Xem trước <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                </a> */}
                                <NavLink to={`/courses/learn/${slug}/preview`} className="flex items-center text-sm">Xem trước <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                </NavLink>
                            </div>
                            <div className='mt-4  max-w-[46rem]'>
                                {course.data.length > 0 && (
                                    <>
                                        {course.data[0].children.map((child) => (
                                            <CourseAccordion key={child.id} title={child.name} content={child.children} />
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='my-0 mx-auto pb-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                            <div className='max-w-[46rem] '>
                                <h1 className='font-bold text-2xl'>
                                    YÊU CẦU KHÓA HỌC
                                </h1>
                            </div>
                            <div className='mt-4 max-w-[46rem]'>
                                <div className='prose' dangerouslySetInnerHTML={{
                                    __html: `${course.data[0].requirement || `Không có yêu cầu`}`
                                }} />
                            </div>
                        </div>
                        <div id='lecturer-detail' className='my-0 mx-auto pb-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                            <div className='max-w-[46rem] flex justify-between items-center'>
                                <h1 className='font-bold text-2xl'>
                                    GIẢNG VIÊN
                                </h1>
                            </div>
                            <div className='mt-4 max-w-[46rem]'>
                                <div className=" md:order-none order-2 text-[16px]">
                                    {/* <div className="mb-6 text-2xl font-medium">Giảng viên</div> */}
                                    <NavLink to={`/profile/${course.data[0].created_by}`} className='text-[#4ba3bb] underline mb-4 block'>{course.data[0].created_user_info[course.data[0].created_by]}</NavLink>

                                    {/* <a className="block md:text-[#006CCB] text-[#F77321] mb-4 text-[16px]" href="teacher/ha-ke-tu">Hà Kế Tú</a> */}
                                    <div className="italic font-light mb-4 text-[16px]">{lecturer?.specialization}</div>
                                    <div className="flex gap-6 mb-10">
                                        <img className="w-[117px] h-[117px] rounded-full" src={lecturer?.avatar ? lecturer?.avatar : defaultAvatar} alt="Rounded avatar" loading="lazy" />
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2 mb-4 ">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.99967 1.33337L10.0597 5.50671L14.6663 6.18004L11.333 9.42671L12.1197 14.0134L7.99967 11.8467L3.87967 14.0134L4.66634 9.42671L1.33301 6.18004L5.93967 5.50671L7.99967 1.33337Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                                {lecturer?.average_rating?.toFixed(1)} xếp hạng
                                            </div>
                                            {/* <div className="flex items-center gap-2 mb-4">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.99967 1.33337L10.0597 5.50671L14.6663 6.18004L11.333 9.42671L12.1197 14.0134L7.99967 11.8467L3.87967 14.0134L4.66634 9.42671L1.33301 6.18004L5.93967 5.50671L7.99967 1.33337Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                                2,394.0 đánh giá
                                            </div> */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_335_9722)">
                                                        <path d="M11.3337 14V12.6667C11.3337 11.9594 11.0527 11.2811 10.5526 10.781C10.0525 10.281 9.37424 10 8.66699 10H3.33366C2.62641 10 1.94814 10.281 1.44804 10.781C0.947944 11.2811 0.666992 11.9594 0.666992 12.6667V14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M5.99967 7.33333C7.47243 7.33333 8.66634 6.13943 8.66634 4.66667C8.66634 3.19391 7.47243 2 5.99967 2C4.52692 2 3.33301 3.19391 3.33301 4.66667C3.33301 6.13943 4.52692 7.33333 5.99967 7.33333Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M15.333 14V12.6667C15.3326 12.0758 15.1359 11.5019 14.7739 11.0349C14.4119 10.5679 13.9051 10.2344 13.333 10.0867" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M10.667 2.08667C11.2406 2.23354 11.749 2.56714 12.1121 3.03488C12.4752 3.50262 12.6722 4.07789 12.6722 4.67C12.6722 5.26212 12.4752 5.83739 12.1121 6.30513C11.749 6.77287 11.2406 7.10647 10.667 7.25334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_335_9722">
                                                            <rect width="16" height="16" fill="white"></rect>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                {lecturer?.total_subscriptions?.toLocaleString()} học viên
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_335_9726)">
                                                        <path d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6818 14.6663 7.99992C14.6663 4.31802 11.6816 1.33325 7.99967 1.33325C4.31778 1.33325 1.33301 4.31802 1.33301 7.99992C1.33301 11.6818 4.31778 14.6666 7.99967 14.6666Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M6.66699 5.33325L10.667 7.99992L6.66699 10.6666V5.33325Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_335_9726">
                                                            <rect width="16" height="16" fill="white"></rect>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                {lecturer?.total_course?.toLocaleString()} khóa học
                                            </div>
                                        </div>
                                    </div>
                                    <div className="leading-10 text-justify  text-[16px]">
                                        <div className={`prose w-full min-h-[200px]`} dangerouslySetInnerHTML={{
                                            __html: `${lecturer?.description || ``}`
                                        }} />
                                        {/* <strong>Giảng viên Hà Kế Tú - Haketu</strong> với kinh nghiệm 12 năm để chơi đàn và nghiên cứu về âm nhạc, 5 năm kinh nghiệm tổ chức các khóa học Guitar offline tại Úc và Hà Nội, đào tạo hàng trăm học viên trong những khóa: Guitar cổ điển, Fingerstyle và Đệm hát.
                                        <strong>Hà Kế Tú</strong>&nbsp;hay còn thường gọi là Haketu&nbsp;là một trong những Giảng viên, Youtuber có tên tuổi trong cộng đồng Guitar tại Việt Nam.&nbsp;
                                        Kênh Youtube hiện đang là một trong những cộng đồng guitar lớn nhất Việt Nam với 600,000 người theo dõi.
                                        Phương pháp giảng dạy của anh chú trọng tới căn bản, áp dụng thực tế trong việc học nhạc và luôn hướng tới học viên để có hiệu quả cao nhất.
                                        Haketu là một trong những người đầu tiên có kênh Youtube dạy guitar phi lợi nhuận tại Việt Nam.
                                        - Thời điểm hiện tại, kênh youtube của Haketu đã đạt mức 550,000 subscribers.
                                        - Giảng viên xuất phát từ học âm nhạc cổ điển, và hiện đã có hơn 12 năm chơi đàn và nghiên cứu về guitar, cũng như viết ra hàng trăm bản guitar tab để làm học liệu.
                                        - Haketu được biết tới với phương pháp truyền tải cách học đơn giản, dễ hiểu và hiệu quả, nên nhiều người tìm tới học cả online và offline rất đông.
                                        - Hiện tại Facebook cũng có trên 180,000 người theo dõi.
                                        - Thế mạnh của Haketu là khả năng chuyển soạn fingerstyle độc tấu trên guitar, và nổi tiếng nhất là Nhật ký của mẹ (nhạc sĩ Nguyễn Văn Chung). */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='my-0 mt-4 mx-auto pb-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6 '>
                            <div className='max-w-[46rem] flex justify-between items-center mb-[10px]'>
                                <h1 className='font-bold text-2xl'>
                                    BÌNH LUẬN
                                </h1>
                                <button className='font-bold text-2xl'
                                    title='Tải lại bình luận'
                                    onClick={() => {
                                        handleReloadComment();
                                    }}>
                                    <FontAwesomeIcon icon={faSync} />
                                </button>
                            </div>
                            <div className='relative max-w-[46rem] rounded-lg bg-white p-6 pt-2 border-1 border-[#dfe7ef]'>
                                {/* <div className='' dangerouslySetInnerHTML={{
                                    __html: `${course.data[0].requirement || `Không có yêu cầu`}`
                                }} /> */}
                                {commentLoading && (
                                    <div className='absolute w-full h-full'>
                                        <div className='absolute bg-gray-400 w-full h-full opacity-50'></div>
                                        <div className='absolute flex items-center z-10 top-0 bottom-0  left-0 right-0 justify-center'>
                                            <Spinner color="teal" width={100} height={100} />
                                        </div>
                                    </div>
                                )}
                                <Comments comments={comment} currentUser={userData?.id} courseId={extractIdSlug(slug)} reload={handleReloadComment} />
                                {(commentPage < commentTotalPage) ? (
                                    <div className='flex justify-center mt-4'>
                                        <Button handleOnClick={() => setCommentPage(commentPage + 1)} style="w-full h-[40px] shadow-lg bg-white ring-gray-300 hover:bg-gray-100" label={'Xem thêm'} severity="info" rounded />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {openVideoReviewDialog && course.data[0].video_path && (
                        <VideoReviewDialog videoPath={course.data[0].video_path} course={course.data[0]} open={openVideoReviewDialog} setOpen={handleOpenVideoReviewDialog} />
                    )}
                </div>))}
        </div>
    );
};

export default CourseDeTail;