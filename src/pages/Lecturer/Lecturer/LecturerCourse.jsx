import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import CourseCard from '../../../components/Card/CourseCard';
import { Pagination, Tooltip } from '@mui/material';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { apiGetCourse } from '../../../apis/course';
import { Select, Option } from "@material-tailwind/react";
import Path from '../../../utils/path';
import e from 'cors';

const LectureCourse = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [myCourseList, setMyCourseList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const getMyCourse = async (pageIndex, refresh) => {
        if (!loading) {
            setLoading(true);
            try {
                // const paramsAPI = getParams(pageIndex);
                const paramsAPI = {
                    created_by: window.location.pathname.normalize().includes('admin') ? '' : userData?.id,
                    build_child: false,
                    max_result: 20,
                    current_page: pageIndex || 1,
                    multi_value: refresh ? '' : keyword,
                };
                const response = await apiGetCourse(paramsAPI);
                if (response?.data?.data?.length > 0) {
                    console.log('---my course---', response.data.total_page);
                    setMyCourseList(response.data);
                    // console.log('---my course---', response.data.data);
                }
                else {
                    setMyCourseList([]);
                    console.log('---my course empty---');

                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course data", error);
                setMyCourseList([]);
            } finally {
                setLoading(false);
            }
        }
    };
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            // if (keyword.trim() !== '') {
            getMyCourse(1, false);
            // }
        }
    };
    const handleChanged = () => {
        getMyCourse(currentPage);
    };
    const refresh = () => {
        setKeyword('');
        getMyCourse(1, true);
    };
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
        getMyCourse(value);
    };
    useEffect(() => {
        setCurrentPage(1);
        getMyCourse();
    }, []);
    return (
        <div className={`relative ${loading ? 'pointer-events-none' : ''}`}>
            <div className='mb-8 flex items-center gap-x-3'>
                <Typography className='text-4xl font-serif font-medium text-black'>
                    Khóa học
                </Typography>

            </div>
            <div className='mb-8 flex justify-between items-center gap-4 flex-wrap'>
                <div className='flex  items-center gap-x-6 '>
                    <div className='relative h-[50px] flex'>
                        <input
                            type="text"
                            value={keyword}
                            placeholder='Tìm kiếm khóa học'
                            className='border-[#003a47] w-[450px] border-r-0 px-4 outline-none h-full border '
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => handleEnter(e)}
                        />
                        <div className=' border cursor-pointer border-[#003a47] duration-200 group/search hover:bg-[#2d2f31] w-[50px] h-[50px] flex justify-center items-center'>
                            <FontAwesomeIcon className='group-hover/search:text-white duration-200 ' icon={faMagnifyingGlass} />
                        </div>
                        <Tooltip title="Tải lại" arrow placement='right'>
                            <div onClick={() => refresh()} className='ml-4 border cursor-pointer border-[#003a47] duration-200 group/search hover:bg-[#2d2f31] w-[50px] h-[50px] rounded-full flex justify-center items-center'>
                                <FontAwesomeIcon className='group-hover/search:text-white duration-200 ' icon={faRotate} />
                            </div>
                        </Tooltip>
                    </div>
                    <div>
                        {/* <div className='min-w-[8rem] h-[50px] border group/sort duration-200 hover:bg-black hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                Sắp xếp theo
                            </Typography>
                        </div> */}
                    </div>
                </div>
                <div>
                    {!window.location.pathname.normalize().includes('admin') && (
                        <NavLink to={`${Path.LECTURER_P}save`}>
                            <div className='min-w-[8rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                    Khóa học mới
                                </Typography>
                            </div>
                        </NavLink>
                    )}
                </div>
            </div>
            {myCourseList.data?.length > 0 ? (
                <>
                    {myCourseList?.data.map((content, index) => (
                        <CourseCard key={index} content={content} changed={handleChanged} />
                    ))}
                    {/* <CourseCard content={{ courseType: "DRAFT" }} />
                    <CourseCard content={{ courseType: "WAITING" }} />
                    <CourseCard content={{ courseType: "OFFICIAL" }} />
                    <CourseCard content={{ courseType: "CHANGE_PRICE" }} /> */}

                    {myCourseList?.total_page > 0 && (
                        <div className='flex justify-center items-center gap-x-3  mb-[40px] pb-[40px]'>
                            <Pagination size='large' className='text-xl' page={currentPage} onChange={handleChangePage} count={myCourseList?.total_page} showFirstButton showLastButton />

                        </div>
                    )}
                </>
            ) : (
                <div className="border border-[#d1d7dc] mb-6 flex justify-center items-center h-[120px]">
                    <div className='flex flex-col items-center gap-y-2'>
                        <Typography>Chưa có khóa học</Typography>
                        <NavLink to={`${Path.LECTURER_P}save`}>
                            <div className='min-w-[8rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                    Tạo ngay
                                </Typography>
                            </div>
                        </NavLink>
                    </div>
                </div>

            )}
            {loading && (
                <span className='bg-[#eaeef6] opacity-70 fixed z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                    <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                </span>
            )}
        </div>
    );
};

export default LectureCourse

