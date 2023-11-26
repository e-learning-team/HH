import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import HorizontalCard from '../../components/Card/HorizontalCard';
import AccordionCourseFilter from '../../components/Accordion/AccordionCourseFilter';
// import Pagination from '../../components/Pagination/Pagination';
import { apiGetCourse } from '../../apis/course';
import { apiCategory } from '../../apis/category';
import HorizontalSkeletonCard from '../../components/Skeleton/HorizontalSkeletonCard';
import Path from '../../utils/path';
import { Spinner } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Paginator } from 'primereact/paginator';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
const Courses = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [parentCategory, setParentCategory] = useState(null);
    const [deleteFilter, setDeleteFilter] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterNumber, setFilterNumber] = useState(0);
    const countFilters = () => {
        let count = 0;
        for (const [key] of searchParams.entries()) {
            if (key !== 'keyword' && key !== 'page') {
                count++;
            }
        }
        setFilterNumber(count);
    };
    const getParams = (pageIndex) => {
        setLoading(true);
        const categoryIds = searchParams.getAll('category');
        const subcategoryIds = searchParams.getAll('subcategory');
        const paramsAPI = new URLSearchParams();

        paramsAPI.set('multi_value', searchParams.get('keyword') || '');
        paramsAPI.set('search_type', 'OFFICIAL');
        // paramsAPI.set('current_page', searchParams.get('page') || 1)
        paramsAPI.set('max_result', 10);
        paramsAPI.set('current_page', pageIndex || 1);
        if (categoryIds.length > 0) {
            categoryIds.forEach(categoryId => {
                paramsAPI.append('categories_ids', categoryId);
            });
        }
        if (subcategoryIds.length > 0) {
            subcategoryIds.forEach(categoryId => {
                paramsAPI.append('categories_ids', categoryId);
            });
            categoryIds.forEach(categoryId => {
                paramsAPI.delete('categories_ids', categoryId)
            })
        }
        // setLoading(false)
        return paramsAPI;
    };
    const searchCourse = async (pageIndex) => {
        try {
            const paramsAPI = getParams(pageIndex);
            const response = await apiGetCourse(paramsAPI);
            if (response.data && response.data.data && response.data.data?.length > 0) {
                setCourseList(response.data);
            }
            else {
                setCourseList([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching course data", error);
            setCourseList([]);
        } finally {
            setLoading(false);
        }
    };
    const handleChangePage = (event, value) => {
        searchCourse(value);
    };
    const handleDeleteFilters = () => {
        console.log("Delete Filters");
        setLoading(true);

        setSearchParams((currentSearchParams) => {
            const newSearchParams = new URLSearchParams(currentSearchParams.toString());
            const keywordValue = newSearchParams.get('keyword');

            newSearchParams.delete('subcategory');
            newSearchParams.delete('category');

            if (keywordValue) {
                newSearchParams.set('keyword', keywordValue);
            }

            setParentCategory(null);
            setDeleteFilter(true);

            setLoading(false);

            return newSearchParams;
        });
    };
    useEffect(() => {
        setLoading(true);
        if (searchParams.get('category')) {
            setParentCategory(searchParams.get('category'));
        }
        countFilters();
        document.title = searchParams.get('keyword') || "Tìm kiếm";
        searchCourse();
    }, [searchParams, isLoggedIn]);


    return (
        <div className={`pt-[40px] relative pb-[80px] h-screen justify-center ${loading ? 'pointer-events-none bg-slate-200 opacity-60 ' : ''}`}>
            <div className="container mx-auto md:max-w-6xl">
                {/* {loading || ( */}
                <div className='flex w-full ml-3 justify-between mb-8 pb-3'>
                    <div className='flex gap-3 justify-between items-center'>
                        <div className='min-w-[8rem] py-4 border hover:bg-slate-200 cursor-pointer border-slate-400 flex justify-center gap-1 items-center'>
                            <FontAwesomeIcon icon={faBars} />
                            <Typography className='font-bold text-base text-black'>
                                Bộ lọc
                            </Typography>
                            <Typography className='font-bold text-base underline text-black'>
                                ({filterNumber})
                            </Typography>
                        </div>
                        <div className='min-w-[8rem] py-4 border hover:bg-slate-200 cursor-pointer border-slate-400 flex justify-center items-center'>
                            <Typography className='font-bold text-base text-black'>
                                Sắp xếp theo
                            </Typography>
                        </div>
                        {filterNumber > 0 && (
                            <div onClick={() => handleDeleteFilters()}>
                                <Typography className='font-bold text-base text-black hover:underline cursor-pointer py-4'>
                                    Xóa bộ lọc
                                    {/* {searchParams.toString()} */}
                                </Typography>
                            </div>
                        )}
                    </div>
                    <div className='flex gap-2 items-center'>
                        {!loading && (
                            <>
                                <Typography className='font-bold text-base underline text-[#585b5e]'>
                                    {courseList?.data?.length ? (
                                        <>
                                            {`${(courseList?.data?.length)?.toLocaleString()} trên ${(courseList?.total)?.toLocaleString()}`}
                                        </>
                                    ): ('Không có')}
                                </Typography>
                                <Typography className='font-bold text-base text-[#8c9196]'>
                                    {` Kết quả`}
                                </Typography>
                            </>
                        )}
                    </div>
                </div>
                {/* )} */}
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="rounded-l lg:col-span-1">
                        {/* {loading || ( */}
                        <div id="large" className="hidden lg:block lg:shrink-0 my-5 mx-5">
                            <AccordionCourseFilter parentCategoryId={parentCategory} deleteFilter={deleteFilter} />
                        </div>
                        {/* )} */}
                    </div>
                    <div className="rounded-lg lg:col-span-3 my-5">
                        {loading ? (
                            <>
                                <div className='w-full pl-[18rem]'>
                                    <Spinner className='w-[60px] h-auto' color='teal' />
                                </div>
                            </>
                        ) : (courseList?.data?.length > 0 ?
                            <>
                                {courseList?.data.map((course, index) => (
                                    <HorizontalCard key={index} content={course} />
                                ))}
                            </>
                            : (
                                <>
                                    Không có kết quả!
                                </>
                            )
                        )}

                    </div>
                </div>
                {courseList?.total_page > 0 && (
                    <div className='flex justify-center mb-[40px]'>
                        <Pagination size='large' className='text-xl' onChange={handleChangePage} count={courseList?.total_page} showFirstButton showLastButton />
                    </div>

                    // <Pagination total_pages={courseList?.totalPage} />
                )}
            </div>
            {loading && (
                <div className='pointer-events-none fixed bottom-0 m-auto left-0 right-0 bg-slate-200 opacity-50 z-50'>
                </div>
            )}
        </div>

    );
};

export default Courses;