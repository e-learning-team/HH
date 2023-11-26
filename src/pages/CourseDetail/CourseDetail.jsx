import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, Typography } from "@material-tailwind/react";
import {
    faCirclePlay,
    faPenToSquare,
    faPersonChalkboard,
    faInfinity
} from '@fortawesome/free-solid-svg-icons';
import {
    faBookmark,
    faFileAudio,

} from '@fortawesome/free-regular-svg-icons';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '../../components/Button/Button';
import { VideoReviewDialog } from '../../components/Dialog/VideoReviewDialog';
import { getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId, formatTimeStampTo_DDMMYYY, calcRating, extractIdSlug } from '../../utils/helper';
import { apiGetCourse } from '../../apis/course';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiCheckEnrollment, apiSaveEnrollment } from '../../apis/enrollment';

const CourseDeTail = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const { slug } = useParams();
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [totalRatings, setTotalRatings] = useState({});
    const navigate = useNavigate();

    const getCurrentCourse = async () => {
        try {
            const response = await apiGetCourse({ slug: slug, build_child: true });
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
    const handleEnroll = async () => {
        console.log("CLICK enroll");
        if (!isLoggedIn || !userData) {
            toast.warning(`Vui lòng đăng nhập trước`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        const data = {
            user_id: userData.id,
            course_id: extractIdSlug(slug),
        };
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
    };
    const checkEnroll = async (course_id) => {
        const res = await apiCheckEnrollment(course_id);
        if (res && res.data) {
            setIsEnrolled(res.data);
        }
    };

    useEffect(() => {
        getCurrentCourse();
    }, [slug, isLoggedIn]);

    const [openVideoReviewDialog, setOpenVideoReviewDialog] = React.useState(false);
    const handleOpenVideoReviewDialog = () => setOpenVideoReviewDialog(!openVideoReviewDialog);
    return (
        <>
            {loading ? (
                <div className=' flex justify-center h-screen items-center'>
                    <Spinner className='w-20 h-auto' color="teal" />
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
                                                <div className='text-1xl mb-4'>{course.data[0].name_mode}</div>
                                                <div className='mb-2 flex gap-2 text-sm'>
                                                    <RatingBar value={totalRatings.averageRate.toFixed(1)} totalReview={totalRatings.totalRatings} />
                                                    <span>{course.data[0].subscriptions || 0} đã đăng kí.</span>
                                                </div>
                                                <div className='font-normal text-sm mb-2'>
                                                    <span>
                                                        <FontAwesomeIcon icon={faPersonChalkboard} className='mr-1 text-[#faaf00]' />
                                                        Được tạo bởi:
                                                    </span>
                                                    <span className='text-[#64ceeb]'> {course.data[0].created_user_info[course.data[0].created_by]}</span>
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
                                        <div className=''>
                                            <div className='relative border-solid border-b stroke-white'>
                                                <span onClick={handleOpenVideoReviewDialog} className='cursor-pointer absolute z-10 flex  justify-center items-center mx-auto my-0 w-full h-full'>
                                                    <FontAwesomeIcon className='h-20 text-white border-solid border-b-2 stroke-white rounded-full bg-[#003a47]' icon={faCirclePlay} />
                                                    <span className='absolute z-20 bottom-4 w-full flex justify-center items-center text-white font-bold'>
                                                        Xem trước khóa học
                                                    </span>
                                                </span>

                                                <span className='absolute h-full w-full bg-gradient-to-b from-transparent to-black  '>
                                                </span>

                                                <img className='h-full w-full bg-cover object-contain' src={course.data[0].video_path
                                                    ? getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(course.data[0].video_path))
                                                    : "https://img-c.udemycdn.com/course/240x135/5246952_37c4.jpg"} />
                                            </div>
                                        </div>
                                        <div className='p-6  bg-white rounded-b-lg'>
                                            <div className=' mb-6 text-[#003a47] text-[2.2rem]'>
                                                <span className='font-mono font-semibold'>{course.data[0].price_sell ? course.data[0].price_sell.toLocaleString() + "₫" : (<>Miễn phí</>)}</span>
                                            </div>
                                            <div className='mb-6 flex gap-2'>
                                                {isEnrolled ? (
                                                    <NavLink to={`/courses/learn/${slug}`} className="flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm ring-1 ring-inset bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white">Học ngay</NavLink>
                                                ) : (
                                                    <Button handleOnClick={handleEnroll} style="flex-1 bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white" label="Đăng kí học" severity="info" rounded />
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
                                        <span>
                                            {course.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='my-0 mx-auto pb-12 max-w-6xl sm:px-6 sm:pb-6 md:px-6 md:pb-6'>
                                <div className='max-w-[46rem] '>
                                    <h1 className='font-bold text-2xl'>
                                        NỘI DUNG KHÓA HỌC
                                    </h1>
                                </div>
                                <div className='mt-4 max-w-[46rem]'>
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
                                    <ul className='list-disc list-inside'>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {openVideoReviewDialog && course.data[0].video_path && (
                            <VideoReviewDialog videoTitle={course.data[0].name} videoPath={course.data[0].video_path} open={openVideoReviewDialog} setOpen={handleOpenVideoReviewDialog} />
                        )}
                    </div>))}
        </>
    );
};

export default CourseDeTail;