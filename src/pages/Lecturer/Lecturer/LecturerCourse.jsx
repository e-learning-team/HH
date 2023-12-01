import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import CourseCard from '../../../components/Card/CourseCard';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { apiGetCourse } from '../../../apis/course';
import Path from '../../../utils/path';

const LectureCourse = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [myCourseList, setMyCourseList] = useState([]);

    const getMyCourse = async (pageIndex) => {
        try {
            // const paramsAPI = getParams(pageIndex);
            const paramsAPI = {
                created_by: userData?.id,
                build_child: false
            };
            const response = await apiGetCourse(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setCourseList(response.data);
                console.log('---my course---', response.data);
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
    };
    useEffect(() => {
        getMyCourse();
    }, []);
    return (
        <div className='relative'>
            <div className='mb-8'>
                <Typography className='text-4xl font-serif font-medium text-black'>
                    Khóa học
                </Typography>
            </div>
            <div className='mb-8 flex justify-between items-center gap-4 flex-wrap'>
                <div className='flex  items-center gap-x-6 '>
                    <div className='relative h-[50px] flex'>
                        <input
                            type="text"
                            // value={payload.keyword}
                            placeholder='Tìm kiếm khóa học'
                            className='border-[#003a47] border-r-0 px-4 outline-none h-full border '
                        // onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))}
                        // onKeyDown={(e) => handleEnter(e)}
                        />
                        <div className=' border cursor-pointer border-[#003a47] duration-200 group/search hover:bg-[#2d2f31] w-[50px] h-[50px] flex justify-center items-center'>
                            <FontAwesomeIcon className='group-hover/search:text-white duration-200 ' icon={faMagnifyingGlass} />
                        </div>
                    </div>
                    <div>
                        <div className='min-w-[8rem] h-[50px] border group/sort duration-200 hover:bg-black hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                Sắp xếp theo
                            </Typography>
                        </div>
                    </div>
                </div>
                <div>
                    <NavLink to={`${Path.LECTURER_P}save`}>
                        <div className='min-w-[8rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                Khóa học mới
                            </Typography>
                        </div>
                    </NavLink>
                </div>
            </div>
            {myCourseList.data?.length > 0 ? (
                <>
                    <CourseCard content={{ course_type: "OFFICIAL" }} />
                    <CourseCard content={{ course_type: "DRAFT" }} />
                    <CourseCard content={{ course_type: "WAITING" }} />
                </>
            ) : (
                <div className="border border-[#d1d7dc] mb-6 flex justify-center items-center h-[120px]">
                    <div className='flex flex-col items-center gap-y-2'>
                        <Typography>Chưa có khóa học</Typography>
                        <div className='min-w-[8rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                Tạo ngay
                            </Typography>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default LectureCourse

