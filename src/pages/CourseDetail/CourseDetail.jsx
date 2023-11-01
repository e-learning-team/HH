import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { Breadcrumbs } from "@material-tailwind/react";
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from "@material-tailwind/react";
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
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Button from '../../components/Button/Button';
import { VideoReviewDialog } from '../../components/Dialog/VideoReviewDialog';
import { getVideoGoogleGDriveUrl, getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId, formatTimeStampTo_DDMMYYY } from '../../utils/helper';
import { apiGetCourse } from '../../apis/course';
const CourseDeTail = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const getCurrentCourse = async () => {
        try {
            const response = await apiGetCourse({ slug: slug });
            if (!response.data && !response.data && response.data.data?.length === 0 || response.data?.data[0]?.level != 1) {
                console.log("error")
                navigate(`/error`);
            }
            setCourse(response.data);
        } catch (error) {
            console.error("Error fetching course data", error);
            navigate(`/error`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCurrentCourse();
        
        
    }, [slug]);
    
    const [openVideoReviewDialog, setOpenVideoReviewDialog] = React.useState(false);
    const handleOpenVideoReviewDialog = () => setOpenVideoReviewDialog(!openVideoReviewDialog);
    return (
        <>
            {
            loading ? (
                <div className='pt-[80px] flex justify-center h-screen items-center'>
                    <Spinner className='w-20 h-auto' color="blue" />

                </div>
            ) :
                // (course && course.data && course.data.length > 0) &&
                (
                    <div>
                        <div className='pt-[80px] mb-[80px]'>
                            <div className='h-auto  bg-[#003a47]'>
                                <div className='my-0 mx-auto py-12 max-w-6xl '>
                                    <div className='max-w-[46rem]'>
                                        <div className=' text-white '>
                                            <div className=''>
                                                {/* <Breadcrumbs separator='>' className='p-0 mb-4 text-[#87CEEB] text-2xl font-bold'>
                                            <a href="#" className="opacity-100 hover:opacity-60">
                                                Docs
                                            </a>
                                            <a href="#" className="opacity-100 hover:opacity-60">
                                                Components
                                            </a>
                                            <a href="#">Breadcrumbs</a>
                                        </Breadcrumbs> */}
                                                <h1 className='text-3xl font-bold  mb-4'>{course.data[0].name}</h1>
                                                <div className='text-1xl mb-4'>{course.data[0].name_mode}</div>
                                                <div className='mb-2 flex gap-2 text-sm'>
                                                    <RatingBar value={4.2} totalReview={245} />
                                                    <span>{course.data[0].subscriptions} đã đăng kí.</span>
                                                </div>
                                                <div className='font-normal text-sm mb-2'>
                                                    <span>
                                                        <FontAwesomeIcon icon={faPersonChalkboard} className='mr-1 text-[#faaf00]' />
                                                        Được tạo bởi:
                                                    </span>
                                                    <span className='text-[#64ceeb]'> {course.data[0].created_by}</span>
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
                            <div className='my-0 mx-auto max-w-6xl'>
                                <div className='ml-[50rem] shadow-lg transition border-solid border stroke-white w-[22rem] absolute top-28'>
                                    <div className='w-full'>
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

                                                <img className='h-full w-full bg-cover' src={getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(course.data[0].video_path))} />
                                            </div>
                                        </div>
                                        <div className='p-6  bg-white'>
                                            <div className=' mb-6 text-[#003a47] text-[2.2rem]'>
                                                <span className='font-mono font-semibold'>266.666</span>
                                                <span className=' underline  decoration-solid '>đ</span>
                                            </div>
                                            <div className='mb-6 flex gap-2'>
                                                <Button style="flex-1 bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white" label="Đăng kí học" severity="info" rounded />
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
                            <div className='my-0 mx-auto py-12 max-w-6xl'>
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
                            <div className='my-0 mx-auto pb-12 max-w-6xl '>
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

                            <div className='my-0 mx-auto pb-12 max-w-6xl'>
                                <div className='max-w-[46rem] '>
                                    <h1 className='font-bold text-2xl'>
                                        YÊU CẦU KHÓA HỌC
                                    </h1>
                                </div>
                                <div className='mt-4 max-w-[46rem]'>
                                    <ul className='list-disc list-inside'>
                                        {/* <li className=''>Kiến thức cơ bản về toán học</li>
                                <li className=''>Đam mê với lập trình</li> */}
                                    </ul>
                                </div>
                            </div>


                        </div>
                        {
                            openVideoReviewDialog && (
                                <VideoReviewDialog videoTitle={course.data[0].name} videoPath={course.data[0].video_path} open={openVideoReviewDialog} setOpen={handleOpenVideoReviewDialog} />
                            )
                        }
                    </div>
                )}
        </>
    );
};

export default CourseDeTail;