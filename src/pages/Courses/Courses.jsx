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
import { Paginator } from 'primereact/paginator';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import noImg from "../../assets/no-image-icon.jpg";
//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faBars,
    faAngleRight,
    faUser,
    faUserGroup,
    faBook,
} from '@fortawesome/free-solid-svg-icons';
//css
import '../../styles/courses.css';
import { sassNull } from 'sass';
const Courses = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const [courseList, setCourseList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [keySearch, setKeySearch] = useState(searchParams.get('keyword') || null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [parentCategory, setParentCategory] = useState(null);
    const [deleteFilter, setDeleteFilter] = useState(false);
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
        paramsAPI.set('max_result', 3);
        paramsAPI.set('is_deleted', 'false');
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
                paramsAPI.delete('categories_ids', categoryId);
            });
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

    const searchCategory = async () => {
        try {
            setLoading(true);
            const params = {
                build_type: "TREE",
                level: 1,
            };

            const response = await apiCategory(params);

            if (response?.data?.length > 0) {
                setCategories(response.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching course data", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
        searchCourse(value);
    };
    const handleDeleteFilters = () => {
        console.log("Delete Filters");
        setLoading(true);
        setCurrentPage(1);
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
        setCurrentPage(1);

        if (searchParams.get('category')) {
            setParentCategory(searchParams.get('category'));
        }
        countFilters();
        setKeySearch(searchParams.get('keyword') || null)
        document.title = searchParams.get('keyword') || "Tìm kiếm";
        searchCategory();
        searchCourse();
    }, [searchParams, isLoggedIn]);


    const [sortBy, setSortBy] = useState(null);
    const sorts = [
        { name: 'Mặc định', code: sassNull },
        { name: 'Giá thấp đến cao', code: 'ASC_PRICE' },
        { name: 'Giá cao đến thấp', code: 'DESC_PRICE' }
    ];

    return (
        // <div className={`pt-[40px] relative pb-[80px] h-screen justify-center ${loading ? 'pointer-events-none bg-slate-200 opacity-60 ' : ''}`}>
        //     <div className="container mx-auto md:max-w-7xl">
        //         {/* {loading || ( */}
        //         <div className='flex w-full ml-3 justify-between mb-8 pb-3'>
        //             <div className='flex gap-3 justify-between items-center'>
        //                 <div className='min-w-[8rem] py-4 border hover:bg-slate-200 cursor-pointer border-slate-400 flex justify-center gap-1 items-center'>
        //                     <FontAwesomeIcon icon={faBars} />
        //                     <Typography className='font-bold text-base text-black'>
        //                         Bộ lọc
        //                     </Typography>
        //                     <Typography className='font-bold text-base underline text-black'>
        //                         ({filterNumber})
        //                     </Typography>
        //                 </div>
        //                 <div className='min-w-[8rem] py-4 border hover:bg-slate-200 cursor-pointer border-slate-400 flex justify-center items-center'>
        //                     <Typography className='font-bold text-base text-black'>
        //                         Sắp xếp theo
        //                     </Typography>
        //                 </div>
        //                 {filterNumber > 0 && (
        //                     <div onClick={() => handleDeleteFilters()}>
        //                         <Typography className='font-bold text-base text-black hover:underline cursor-pointer py-4'>
        //                             Xóa bộ lọc
        //                             {/* {searchParams.toString()} */}
        //                         </Typography>
        //                     </div>
        //                 )}
        //             </div>
        //             <div className='flex gap-2 items-center'>
        //                 {!loading && (
        //                     <>
        //                         <Typography className='font-bold text-base underline text-[#585b5e]'>
        //                             {courseList?.data?.length ? (
        //                                 <>
        //                                     {`${(courseList?.data?.length)?.toLocaleString()} trên ${(courseList?.total)?.toLocaleString()}`}
        //                                 </>
        //                             ) : ('Không có')}
        //                         </Typography>
        //                         <Typography className='font-bold text-base text-[#8c9196]'>
        //                             {` Kết quả`}
        //                         </Typography>
        //                     </>
        //                 )}
        //             </div>
        //         </div>
        //         {/* )} */}
        //         <div className="grid grid-cols-1 lg:grid-cols-4">
        //             <div className="rounded-l lg:col-span-1">
        //                 {/* {loading || ( */}
        //                 <div id="large" className="hidden lg:block lg:shrink-0 my-5 mx-5">
        //                     <AccordionCourseFilter parentCategoryId={parentCategory} deleteFilter={deleteFilter} />
        //                 </div>
        //                 {/* )} */}
        //             </div>
        //             <div className="rounded-lg lg:col-span-3 my-5">
        //                 {loading ? (
        //                     <>
        //                         <div className='w-full pl-[18rem]'>
        //                             <Spinner className='w-[60px] h-auto' color='teal' />
        //                         </div>
        //                     </>
        //                 ) : (courseList?.data?.length > 0 ?
        //                     <>
        //                         {courseList?.data.map((course, index) => (
        //                             <HorizontalCard key={index} content={course} />
        //                         ))}
        //                     </>
        //                     : (
        //                         <>
        //                             Không có kết quả!
        //                         </>
        //                     )
        //                 )}

        //             </div>
        //         </div>
        //         {courseList?.total_page > 0 && (
        //             <div className='flex justify-center mb-[40px] pb-[40px]'>
        //                 <Pagination size='large' className='text-xl' page={currentPage} onChange={handleChangePage} count={courseList?.total_page} showFirstButton showLastButton />
        //             </div>
        //         )}
        //     </div>
        //     {loading && (
        //         <div className='pointer-events-none fixed bottom-0 m-auto left-0 right-0 bg-slate-200 opacity-50 z-50'>
        //         </div>
        //     )}
        // </div>

        <div>
            <div className="breadcrumbs section-padding bg-[url('../assets/bred.png')] bg-cover bg-center bg-no-repeat">
                <div class="container text-center">
                    <nav>
                        <ol class="flex items-center justify-center space-x-3">
                            {keySearch?.trim().length > 0 ? (
                                <>
                                    <h2 class="text-lg font-bold text-[#555]">Tìm kiếm:</h2>
                                    <span class="space-x-2 text-[#676e7b]">{keySearch}</span>
                                </>) : 
                                (<></>)}
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="section-padding bg-[url('../assets/insbg.png')] bg-no-repeat pt-10">
                <div className="container">
                    <div className="grid grid-cols-12 gap-[30px]">
                        <div className="lg:col-span-3 col-span-12">
                            {/* <div class="wdiget widget_search">
                                <div class="bg-[#F8F8F8] flex  rounded-md shadow-e1 items-center py-[4px] pl-3 relative">
                                    <div class="flex-1">
                                        <input type="text" placeholder="Tìm kiếm khoá học..." class="border-none focus:ring-0 bg-transparent" />
                                    </div>
                                    <div class="flex-none">
                                        <button class="btn-primary rounded-md bg-[#4cbdff] text-[white] py-4 px-8 inline-block text-base leading-6 font-medium transition-all ease-in-out duration-300">
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className="" /></button>
                                    </div>
                                </div>
                            </div> */}
                            <div class="wdiget widget_catagory">
                                <h4 class="text-[22px] leading-8 font-bold text-[#555] mb-8">Danh mục</h4>
                                <ul class=" list-item space-y-4">
                                    {categories?.length > 0 ?
                                        <>
                                            {categories?.map((category, index) => (
                                                <li class="block">
                                                    <NavLink className="flex justify-between items-center bg-[#F8F8F8] py-[17px] px-5 rounded hover:bg-[#4cbdff] hover:text-white transition-all duration-150 text-[#676e7b]">
                                                        <span className="text-inherit">{category.title}</span>
                                                        <span class=" text-2xl">
                                                            <FontAwesomeIcon icon={faAngleRight} className="text-inherit" />
                                                        </span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </> : (<></>)}
                                </ul>
                            </div>
                        </div>
                        <div className="lg:col-span-9 col-span-12">
                            {loading ? (
                                <>
                                    <div className='w-full pl-[18rem]'>
                                        <Spinner className='w-[60px] h-auto' color='teal' />
                                    </div>
                                </>
                            ) : (courseList?.data?.length > 0 ?
                                <>
                                    <div class="wdiget py-4 flex md:flex-row flex-col items-center mb-8 space-y-6 md:space-y-0 justify-between">
                                        <span className="text-lg text-[#676e7b]">Hiển thị {(courseList?.data?.length)?.toLocaleString()} của {(courseList?.total)?.toLocaleString()} khoá học tìm thấy</span>
                                        <div class="flex-0 md:flex md:content-center">
                                            <div class="min-w-[272px]">
                                                <Dropdown value={sortBy} onChange={(e) => setSortBy(e.value)} options={sorts} optionLabel="name"
                                                    placeholder="Sắp xếp khoá học" className="w-full p-0 hover:border-[#ced4da]" checkmark={true} highlightOnSelect={false} />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="content">
                                        <div className="flex flex-col gap-[30px]">


                                            {courseList?.data.map((course, index) => (
                                                // <HorizontalCard key={index} content={course} />
                                                <>
                                                    <NavLink className="bg-white rounded-[8px] transition shadow-box7 duration-150 border-b-4 hover:border-[#4cbdff] border-transparent
                                                                    hover:shadow-box6 flex p-8 space-x-6" href="single-course.html">
                                                        <div class="flex-none">
                                                            <div class="h-[159px] w-[260px] rounded relative">
                                                                <img src={course.image_path ? course.image_path : noImg} alt="" class=" w-full h-full object-cover rounded" />
                                                            </div>
                                                        </div>
                                                        <div class="course-content flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <div className="line-clamp-1 flex-1">
                                                                    <h4 class="text-2xl leading-[36px] mb-4 font-bold text-[#333] line-clamp-2">{course.name}</h4>
                                                                </div>
                                                                <div class="text-2xl font-bold text-[#555] items-end flex-col flex">
                                                                    <span class="price-sale webkit-fill-available" data-value="399000">399.000đ</span>
                                                                    <span class="pl-1 text-[#929292] line-through text-lg webkit-fill-available">600.000đ</span>
                                                                </div>
                                                            </div>

                                                            <div class="flex space-x-6 mb-4">
                                                                <span class="flex items-center space-x-2 text-[#676e7b]">
                                                                    <FontAwesomeIcon icon={faBook} className="" />
                                                                    <span>{course.created_user_info[course.created_by]}</span>
                                                                </span>
                                                                <span class="flex items-center space-x-2 text-[#676e7b]">
                                                                    <FontAwesomeIcon icon={faUserGroup} className="" />
                                                                    <span>{course.subscriptions || 0} Học viên</span>
                                                                </span>
                                                            </div>
                                                            <div className=" text-[#676e7b]">
                                                                <span className="line-clamp-2">Xã hội ngày càng phát triển, Tiếng Anh trở thành một ngôn ngữ mang tính chất toàn cầu mà bất cứ ai cũng muốn sở hữu nó.
                                                                    Giao tiếp tiếng Anh tốt không chỉ giúp bạn khám phá nền văn hóa của nhiều nước thế giới, là cơ hội để học hỏi và hội nhập mà nó còn là một
                                                                    “vũ khí lợi hại” để bạn mở rộng cơ hội việc làm với mức lương cao. Để làm được điều này, bạn cần nắm chắc 4 kỹ năng: Nghe, nói, đọc, viết trong Tiếng Anh. </span>
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </>
                                : (
                                    <>
                                        Không có kết quả!
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;