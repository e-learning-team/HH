import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/logo-side-white-text.svg';
import { useNavigate, useParams, NavLink } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from "@material-tailwind/react";
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import 'react-loading-skeleton/dist/skeleton.css';
import { extractIdSlug } from '../../utils/helper';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Path from '../../utils/path';
import { CircularProgressBar } from '../../components/ProgressBar/CircularProgressBar/CircularProgressBar';
import { TabPanel, TabView } from 'primereact/tabview';
import { apiCheckEnrollment, apiMyEnrollment, apiSaveEnrollment } from '../../apis/enrollment';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { CourseRatingDialog } from '../../components/Dialog/CourseRatingDialog';

const CourseLearn = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const { slug } = useParams();
    const [courseName, setCourseName] = useState("");
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [loadingVideo, setLoadingVideo] = useState(true);
    const [openSideBar, setOpenSideBar] = useState(true);
    const [completedCourse, setCompleteCourse] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({});
    const [rate, setRate] = useState({});
    const [deafaultRate, setDeafaultRate] = useState({});
    const [myRate, setMyRate] = useState(0);
    const [myDeafaultRate, setMyDeafaultRate] = useState(0);
    const [openCourseRating, setOpenCourseRating] = useState(false);

    const navigate = useNavigate();
    const contentRefs = useRef(null);
    const checkEnroll = async (course_id) => {
        const res = await apiCheckEnrollment(course_id);
        if (res && res.data) {
            setIsEnrolled(res.data);
            return true;
        } else {
            setIsEnrolled(res.data);
            toast.error(`Cần phải đăng kí để bắt đầu học`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`/courses/${slug}`);
            return false;
        }
    };
    const handleSideBar = () => {
        setOpenSideBar(!openSideBar);
    };
    const handleOpenCourseRating = () => {
        setOpenCourseRating(!openCourseRating);
    };
    const handleLoadingVideo = () => {
        setLoadingVideo(false);
    };
    const handleChangeRate = (newRate) => {
        if (newRate) {
            updateRate(newRate);
        } else {
            console.log("DEAULT", myDeafaultRate);
            updateRate(myDeafaultRate);
        }
    };

    function updateRate(newRate) {
        if (newRate >= 1 && newRate <= 5) {
            const updatedRate = { ...rate };

            updatedRate.ratingCounts[myRate.toString()]--;
            setMyRate(newRate);
            updatedRate.ratingCounts[newRate.toString()]++;

            let totalRatings = updatedRate.totalRatings;
            let sum = 1 * updatedRate.ratingCounts["1"] + 2 * updatedRate.ratingCounts["2"] +
                3 * updatedRate.ratingCounts["3"] + 4 * updatedRate.ratingCounts["4"] +
                5 * updatedRate.ratingCounts["5"];

            updatedRate.averageRate = sum / totalRatings;
            setRate(updatedRate);
        }
    }
    const getMyEnrollment = async () => {
        setLoading(true);
        try {
            const courseId = extractIdSlug(slug);
            const params = {
                course_ids: courseId,
                build_course_child: true
            };
            const res = await apiMyEnrollment(params);
            if (res && res.data && res.data.data) {
                setEnrollmentData(res.data.data[0]);

                setMyRate(res.data.data[0].rating.rate);
                setMyDeafaultRate(res.data.data[0].rating.rate);

                setCompleteCourse(res.data.data[0].completed_course_ids);

                setCourse(res.data.data[0].course);

                setRate(res.data.data[0].course.course_ratings);
                setDeafaultRate(res.data.data[0].course.course_ratings);

                setCourseName(res.data.data[0].course.name);

                document.title = res.data.data[0].course.name;
            }
        } catch (e) {
            toast.error(`Lỗi ${e}`);
            setLoading(false);
            setError(true);
        }
        setLoading(false);
    };
    const handleContentClick = async (clickedContent) => {
        setCurrentCourse({});
        setLoadingVideo(true);
        setCurrentCourse(clickedContent);
        const data = {
            user_id: userData.id,
            course_id: extractIdSlug(slug),
            current_course: clickedContent.id
        };
        const res = await apiSaveEnrollment(data);
        contentRefs.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const handleCheckComplete = (courseId, checked) => {
        if (checked) {
            setCompleteCourse(prevCompletedCourse => [...prevCompletedCourse, courseId]);
        } else {
            setCompleteCourse(prevCompletedCourse =>
                prevCompletedCourse.filter(id => id !== courseId)
            );
        }
    };
    useEffect(() => {
        document.title = "Học";
        if (!isLoggedIn) {
            toast.error("Bạn cần phải đăng nhập trước", {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`/${Path.HOME}`);
            return;
        }
        if (checkEnroll(extractIdSlug(slug))) {
            getMyEnrollment();
        }
    }, []);
    return (
        <>
            {loading ? (
                <div className='w-full h-full'>
                    <div className='w-full h-16 px-8 py-2  text-white bg-[#003a47] z-10'>
                        <div className='h-full flex justify-between'>
                            <div className='h-full  flex justify-center items-center'>
                                <NavLink to={`/`} className='h-full'>
                                    <img src={logo} className='h-full ' alt="" />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className='mt-32'>
                        <Spinner className='w-[60px] m-auto  object-cover object-center h-auto' color="teal" />
                    </div>
                </div>
            ) : (!error && (
                <>
                    <div className=' flex relative '>
                        <div className='w-full h-16 px-8 py-2  text-white fixed bg-[#003a47] z-10'>
                            <div className='h-full flex justify-between'>
                                <div className='h-full  flex justify-center items-center'>
                                    <NavLink to={`/`} className='h-full'>
                                        <img src={logo} className='h-full ' alt="" />
                                    </NavLink>
                                    <div className=' border mx-6 py-3 border-gray-300'></div>
                                    <Typography className='font-normal'>
                                        <NavLink to={`/courses/${slug}`} className='hover:opacity-80 hover:underline'>{courseName}</NavLink>
                                    </Typography>
                                </div>
                                <div className='h-full gap-2 flex  justify-center items-center'>
                                    {/* <CircularProgressBar progress={enrollmentData.percent_complete} /> */}
                                    <CircularProgressBar progress={Math.floor((completedCourse.length / enrollmentData.course?.total_lesson) * 100)} />
                                    <div className='h-full  font-normal flex flex-col justify-center items-center'>
                                        <Typography className='text-[14px] flex-1 line-clamp-1'>Tiến độ hoàn thành</Typography>
                                        <Typography className='text-[14px] flex-1 line-clamp-1 font-bold'>
                                            <span className='underline'>
                                                {completedCourse?.length}/{enrollmentData.course?.total_lesson}
                                            </span> đã học
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='h-full w-full flex pt-16 '>
                            <div className={`'h-auto ' ${openSideBar ? "w-[calc(100%-24rem)]" : 'w-full'}`}>
                                <div className='w-full h-full '>
                                    <div
                                        ref={contentRefs}
                                        className='min-h-[30rem] h-[30rem]  relative bg-[#e2e8f0] w-full'>
                                        {loadingVideo ? (
                                            <div className='absolute flex justify-center items-center top-0 left-0 w-full h-full'>
                                                <Spinner className='w-20 h-auto' color="teal" />
                                            </div>
                                        ) : <></>}
                                        <iframe
                                            className='absolute top-0 left-0 bottom-0 right-0 m-auto'
                                            src={currentCourse?.video_path}
                                            allowFullScreen
                                            width="640"
                                            height="480"
                                            onLoad={handleLoadingVideo}
                                            allow="autoplay"
                                            autoPlay>
                                            <p>Trình duyệt của bạn không có phép iframe.</p>
                                        </iframe>
                                        {!openSideBar && (
                                            <div className=' h-full flex justify-center items-center absolute right-0'>
                                                <div className=' border rounded-sm border-[#003a47] px-4 py-3 transition cursor-pointer hover:bg-[#003a47] hover:text-white' onClick={handleSideBar} >
                                                    <Typography className='font-bold'>
                                                        Xem nội dung
                                                    </Typography>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='w-full mt-2 p-6 bg-[#fff]'>
                                        <TabView className='' >
                                            <TabPanel header="Tổng quan">
                                                <span className="m-0">
                                                    <Typography className='font-bold text-base mb-4'>
                                                        <span>{currentCourse.name}</span>
                                                    </Typography>
                                                    {Array.from({ length: 4 }).map((_, index) => (
                                                        <Typography key={index} className='font-normal mb-4'>
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                        </Typography>
                                                    ))}
                                                </span>
                                            </TabPanel>
                                            <TabPanel header="Đánh giá">
                                                <span className="m-0">
                                                    <Typography className='font-bold text-base uppercase mb-4'>
                                                        <span>Đánh giá của bạn</span>
                                                    </Typography>
                                                    <div className='mb-4'>
                                                        <div className='flex items-center gap-2'>
                                                            <Typography className='text-2xl font-bold text-[#faaf00]'>{myRate.toFixed(1)}</Typography>
                                                            <Rating name="size-large" size='large' readOnly value={myRate} precision={1} />

                                                            <span onClick={handleOpenCourseRating} className='p-2 hover:bg-[#e2e8f0] cursor-pointer rounded'>Thay đổi đánh giá</span>
                                                            {openCourseRating && (
                                                                <CourseRatingDialog open={openCourseRating} setOpen={handleOpenCourseRating} course={{ id: course.id, name: course.name }} changeRate={handleChangeRate} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Typography className='font-bold text-base uppercase mb-4'>
                                                        <span>Đánh giá của học viên</span>
                                                    </Typography>
                                                    <div className=''>
                                                        <div className='flex min-w-[300px] max-w-3xl justify-around gap-5 mx-auto'>
                                                            <div className='flex flex-col items-center justify-evenly'>
                                                                <div>
                                                                    <Typography className='text-4xl font-bold text-[#faaf00]'>{rate?.averageRate.toFixed(1)}</Typography>
                                                                </div>
                                                                <div>
                                                                    <Rating name="size-large" readOnly value={rate?.averageRate} precision={0.5} />
                                                                </div>
                                                                <div>
                                                                    <Typography className='text-base font-bold text-[#faaf00]'>Xếp hạng khóa học</Typography>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-1 flex-col items-center justify-around'>
                                                                <progress value={(rate?.ratingCounts[5] / rate?.totalRatings) * 100} max="100" className="h-2 w-full " />
                                                                <progress value={(rate?.ratingCounts[4] / rate?.totalRatings) * 100} max="100" className="h-2 w-full " />
                                                                <progress value={(rate?.ratingCounts[3] / rate?.totalRatings) * 100} max="100" className="h-2 w-full " />
                                                                <progress value={(rate?.ratingCounts[2] / rate?.totalRatings) * 100} max="100" className="h-2 w-full " />
                                                                <progress value={(rate?.ratingCounts[1] / rate?.totalRatings) * 100} max="100" className="h-2 w-full " />
                                                            </div>

                                                            <div className='flex flex-col items-center justify-start'>
                                                                {[5, 4, 3, 2, 1].map((rating, index) => (
                                                                    <div key={index} className='flex justify-between items-center w-full gap-2'>
                                                                        <Rating size="small" readOnly className='flex-1' value={rating} />
                                                                        <Typography className='font-normal underline cursor-pointer'>
                                                                            {((rate?.ratingCounts[rating] / rate?.totalRatings) * 100).toFixed(1)}%
                                                                        </Typography>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            </TabPanel>
                                            <TabPanel header="Ghi Chú" disabled title="Sẽ cập nhật">

                                            </TabPanel>
                                        </TabView>
                                    </div>
                                </div>
                            </div>
                            <div className={`' fixed right-0 h-full w-[24rem] z-10 bg-gray-50 flex flex-col border-gray-400' ${openSideBar ? '' : 'hidden'}`}>
                                <div className='p-4 flex justify-between items-center border-b border-gray-400'>
                                    <Typography className='font-bold'>Nội dung khóa học</Typography>
                                    <FontAwesomeIcon className='p-2 cursor-pointer rounded-lg w-[18px] h-[18px] hover:bg-gray-200' title='Ẩn thanh bên' icon={faXmark} onClick={handleSideBar} />
                                </div>
                                <div className='h-[100%]  pb-80 overflow-y-auto '>
                                    {course.children.length > 0 && (
                                        <>
                                            {course.children.map((child) => (
                                                <CourseAccordion key={child.id}
                                                    isEnrolled={true}
                                                    enrollmentId={enrollmentData.id}
                                                    title={child.name}
                                                    content={child.children}
                                                    onContentClick={handleContentClick}
                                                    onContentCheck={handleCheckComplete}
                                                    currentCourse={enrollmentData.current_course}
                                                    completeCourse={enrollmentData.completed_course_ids}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ))}
        </>
    );
};

export default CourseLearn;