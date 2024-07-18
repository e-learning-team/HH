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
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { apiUserList } from '../../../apis/user';
import { apiCategory } from '../../../apis/category';

const LectureCourse = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [myCourseList, setMyCourseList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [userList, setUserList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const statusOptions = [
        { icon: 'align-left', text: "Công Khai", value: 'false' },
        { icon: 'align-right', text: "Đã Xóa", value: 'true' },
    ];
    const [searchParams, setSearchParams] = useState({
        search_type: null,
        lecture: null,
        is_deleted: statusOptions[0].value,
        categories_ids: null
    })
    const type = [
        { name: 'Nháp', code: 'DRAFT' },
        { name: 'Live', code: 'OFFICIAL' },
        { name: 'Chờ duyệt', code: 'WAITING' },
        { name: 'Chờ duyệt giá tiền', code: 'CHANGE_PRICE' }
    ];
    const statusTemplate = (option) => {
        return <i className={option.icon}>{option.text}</i>;
    }
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const categoryData = await apiCategory({ build_type: 'LIST' });
            const data = addDashesToTitles(categoryData.data);
            setCategoryList(data);

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setLoading(false);
    };
    const addDashesToTitles = (categories) => {
        return categories.map((category) => {
            const { id, title, children } = category;
            const modifiedTitle = `${category.level != 1 ? (category.level == 3 ? '----' : '--') : ''} ${title}`;

            return {
                id,
                title: modifiedTitle,
                // children: children && children.length > 0 ? addDashesToTitles(children, level + 1) : [],
            };
        });
    };
    const getUsers = async (params) => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('status', 'ENABLE');
            paramsAPI.set('max_result', 100000);

            const response = await apiUserList(paramsAPI);
            if (response?.data?.data?.length > 0) {
                var data = response?.data?.data;
                data?.map((item) => {
                    userList.push({ name: item?.full_name, code: item?.id });
                })
                // setUserList(response.data);
            }
            setLoading(false);
        } catch (error) {
            setUserList([]);
        } finally {
            setLoading(false);
        }
    };
    const getMyCourse = async (pageIndex, refresh) => {
        if (!loading) {
            setLoading(true);
            try {
                // const paramsAPI = getParams(pageIndex);
                // const search_type = new URLSearchParams();
                const paramsAPI = new URLSearchParams();
                paramsAPI.append('created_by', window.location.pathname.normalize().includes('admin') ? '' : userData?.id);
                paramsAPI.append('build_child', false);
                paramsAPI.append('max_result', 5);
                paramsAPI.append('current_page', pageIndex || 1);
                paramsAPI.append('multi_value', refresh ? '' : keyword);

                const selectedType = searchParams?.search_type?.map(r => r?.code);
                const selectedLecture = searchParams?.lecture;
                const selectedStatus = searchParams?.is_deleted;
                const selectedCategoryIds = searchParams.categories_ids?.map(cate => cate?.id);
                if (selectedType?.length > 0) {
                    paramsAPI.set('search_type', selectedType);
                } else {
                    paramsAPI.append('search_type', 'OFFICIAL');
                    paramsAPI.append('search_type', 'DRAFT');
                    paramsAPI.append('search_type', 'WAITING');
                    paramsAPI.append('search_type', 'CHANGE_PRICE');
                }
                if (selectedLecture) {
                    paramsAPI.set('created_by', selectedLecture?.code);
                }
                if (selectedCategoryIds?.length > 0) {
                    selectedCategoryIds.map((cate) => {
                        paramsAPI.append('categories_ids', cate);
                    })
                    // paramsAPI.set('categories_ids', selectedCategoryIds);
                }
                // console.log('---selectedStatus---', selectedStatus);
                if (selectedStatus !== null) {
                    paramsAPI.set('is_deleted', selectedStatus);
                }
                // created_by: window.location.pathname.normalize().includes('admin') ? '' : userData?.id,
                //     build_child: false,
                //     max_result: 20,
                //     current_page: pageIndex || 1,
                //     multi_value: refresh ? '' : keyword,
                //     search_type: search_type,
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
    const handleCategorySelect = (category) => {
        // setSelectedCategory(category);
        console.log('---category---', category);
        setSearchParams((lazyParams) => ({ ...lazyParams, categories_ids: category }))
        // setPayload((prevPayload) => ({
        //     ...prevPayload,
        //     category_ids: selectedCategoryIds,
        // }));
        // setErrors((errors) => ({
        //     ...errors,
        //     category_ids: ""
        // }));
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
        getUsers();
        getMyCourse();
        fetchCategory();
    }, []);
    useEffect(() => {
        setCurrentPage(1);
        getMyCourse(1);
    }, [searchParams]);
    return (
        <div className={`relative ${loading ? 'pointer-events-none' : ''}`}>
            <div className='flex w-full justify-between items-center gap-x-3'>
                <Typography className='text-4xl font-serif font-medium text-black'>
                    Khóa học
                </Typography>
                {!window.location.pathname.normalize().includes('admin') && (
                        <div className='p-4 justify-self-end'>
                            <Typography className='text-lg font-semibold text-black invisible'>
                                <label className="" htmlFor="">2</label>
                            </Typography>
                            <NavLink to={`${Path.LECTURER_P}save`}>
                                <div className='min-w-[8rem]  h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                        Khóa học mới
                                    </Typography>
                                </div>
                            </NavLink>
                        </div>
                    )}
            </div>
            <div className='mb-3 flex justify-between items-center gap-4 flex-wrap'>
                <div className='flex flex-wrap items-center gap-x-6 '>
                    <div className="p-4 w-100">
                        <Typography className='text-lg font-semibold text-black'>
                            <label className="" htmlFor="">Tìm kiếm</label>
                        </Typography>
                        <div className='relative h-[50px] flex'>
                            <input
                                id='searchKeyWord'
                                type="text"
                                value={keyword}
                                placeholder='Tìm kiếm khóa học'
                                className='border-[#003a47] w-[450px] border-r-0 px-4 outline-none h-full border '
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => handleEnter(e)}
                            />
                            <div onClick={() => getMyCourse(1, false)} className=' border cursor-pointer border-[#003a47] duration-200 group/search hover:bg-[#2d2f31] w-[50px] h-[50px] flex justify-center items-center'>
                                <FontAwesomeIcon className='group-hover/search:text-white duration-200 ' icon={faMagnifyingGlass} />
                            </div>
                            <Tooltip title="Tải lại" arrow placement='right'>
                                <div onClick={() => refresh()} className='ml-4 border cursor-pointer border-[#003a47] duration-200 group/search hover:bg-[#2d2f31] w-[50px] h-[50px] rounded-full flex justify-center items-center'>
                                    <FontAwesomeIcon className='group-hover/search:text-white duration-200 ' icon={faRotate} />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="p-4 w-100">
                        <Typography className='text-lg font-semibold text-black'>
                            <label className="" htmlFor="">Trạng thái</label>
                        </Typography>
                        <MultiSelect id="courseType" className="w-full min-w-[250px] max-w-[250px]" value={searchParams.search_type} options={type} onChange={(e) => setSearchParams((lazyParams) => ({ ...lazyParams, search_type: e.value, }))} optionLabel="name" placeholder="Lọc theo" display="chip" />
                    </div>
                    {window.location.pathname.normalize().includes('admin') && (
                        <div className="p-4 w-100">
                            <Typography className='text-lg font-semibold text-black'>
                                <label className="" htmlFor="">Giảng viên</label>
                            </Typography>
                            <Dropdown id="lecturer" filter className="min-w-[450px] max-w-[450px]" value={searchParams.lecture} options={userList} onChange={(e) => setSearchParams((lazyParams) => ({ ...lazyParams, lecture: e.value, }))} optionLabel="name" placeholder="Giảng viên" />
                        </div>
                    )}
                    <div className="p-4 w-100 min-w-[205px]">
                        <Typography className='text-lg font-semibold text-black invisible'>
                            <label className="" htmlFor="">Tìm kiếm</label>
                        </Typography>
                        <SelectButton className='' value={searchParams?.is_deleted} onChange={(e) => setSearchParams((lazyParams) => ({ ...lazyParams, is_deleted: e.value, }))} itemTemplate={statusTemplate} optionLabel="value" options={statusOptions} />
                    </div>
                    {/* <div className="p-4 w-100">
                        <Typography className='text-lg font-semibold text-black'>
                            <label className="" htmlFor="">Danh mục</label>
                        </Typography>
                        <div className='multiselect-container '>
                            <MultiSelect
                                value={searchParams.categories_ids}
                                onChange={(e) => handleCategorySelect(e.value)}
                                // onBlur={() => setSearchParams((lazyParams) => ({ ...lazyParams, categories_ids: selectedCategory }))}
                                options={categoryList} optionLabel="title"
                                display="chip"
                                placeholder="Chọn danh mục"
                                // disabled={content?.courseType !== "DRAFT"}
                                // maxSelectedLabels={3}
                                className="min-w-[400px] max-w-[400px]" />
                        </div>
                    </div> */}
                    
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
                        <div className='flex list-none justify-center items-center gap-x-3  mb-[40px] pb-[40px]'>
                            <Pagination size='large' className='text-xl' page={currentPage} onChange={handleChangePage} count={myCourseList?.total_page} showFirstButton showLastButton />
                        </div>
                    )}
                </>
            ) : (
                <div className="border border-[#d1d7dc] mb-6 flex justify-center items-center h-[120px]">
                    <div className='flex flex-col items-center gap-y-2'>
                        <Typography>Chưa có khóa học</Typography>
                        {!window.location.pathname.normalize().includes('admin') && (
                            <NavLink to={`${Path.LECTURER_P}save`}>
                                <div className='min-w-[8rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                        Tạo ngay
                                    </Typography>
                                </div>
                            </NavLink>
                        )}
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

