import { Input, Spinner, Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from "primereact/editor";
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Path from '../../../utils/path';
import { apiCategory } from '../../../apis/category';
import { TreeSelect } from 'primereact/treeselect';
import { data } from 'autoprefixer';
import { MultiSelect } from 'primereact/multiselect';
// import './style.css';
import { apiGetCourse, apiSaveCourse } from '../../../apis/course';
// import {MyQuillEditor} from '../../../components/Editor/QuillEditor';
const LecturerCourseNew = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(true);
    const [categoryNodes, setCategoryNodes] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [payload, setPayload] = useState({
        name: "",
        description: "",
        requirement: "",
        category_ids: [

        ],
    });
    const [errors, setErrors] = useState({
        name: '',
        category_ids: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', category_ids: '' };

        if (!payload.name.trim()) {
            newErrors.name = 'Vui lòng nhập tên';
            valid = false;
        } else {
            newErrors.name = ''; // Clear the error when the field is valid
        }
        // console.log(selectedCategory?.length)
        if (!selectedCategory?.length) {
            newErrors.category_ids = 'Vui lòng chọn ít nhất 1 danh mục';
            valid = false;
        } else {
            newErrors.category_ids = ''; // Clear the error when the field is valid
        }

        setErrors(newErrors);
        return valid;
    };
    const handleCreateCourse = async () => {
        setProcessing(true);
        if (validateForm()) {
            // Proceed with creating the course
            // ...
            const res = await apiSaveCourse(payload);
            console.log(res)
            // navigate(res)
            if(res?.data){
                navigate(`${Path.LECTURER_P+Path.LECTURER_NEW_COURSE+res?.data.id}`)
            }
        } else {
            toast.error('Vui lòng nhập các trường bắt buộc');
        }
        setProcessing(false);
    };
    const addDashesToTitles = (categories) => {
        return categories.map((category) => {
            const { id, title, children } = category;
            const modifiedTitle = `${category.level != 1 ? (category.level == 3 ? '----' : '--') : ''} ${title}`;

            return {
                id,
                title: modifiedTitle,
                children: children && children.length > 0 ? addDashesToTitles(children, level + 1) : [],
            };
        });
    };
    const fetchCategory = async () => {
        setProcessing(true);
        setLoading(true);
        try {
            const categoryData = await apiCategory({ build_type: 'LIST' });
            const data = addDashesToTitles(categoryData.data);
            setCategoryList(data);

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setProcessing(false);
        setLoading(false);
    };
    const handleNameChange = (name) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            name: name,
        }));
        setErrors((errors) => ({
            ...errors,
            name: ""
        }));
    };
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const selectedCategoryIds = category.map(cate => cate.id);
        // console.log(selectedCategoryIds)
        setPayload((prevPayload) => ({
            ...prevPayload,
            category_ids: selectedCategoryIds, // Assuming category has an 'id' property
        }));
        setErrors((errors) => ({
            ...errors,
            category_ids: ""
        }));
    };
    const handleEditorDescription = (editorData) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            description: editorData,
        }));
    };
    const handleEditorRequireMent = (editorData) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            requirement: editorData,
        }));
    };
    useEffect(() => {
        document.title = "Tạo khóa học";
    }, []);
    useEffect(() => {
        fetchCategory();
    }, []);
    return (
        <>
            <form action='#' className='relative'>
                <div className={`h-full w-full flex justify-center items-center my-8 min-w-[500px]  ${processing ? '!pointer-events-none' : ''}`}>
                    <div className='shadow-md border flex flex-col rounded-md  min-w-[500px]  p-10'>
                        <div className='flex mb-4 min-w-[500px] justify-center'>
                            {/* <Typography className='font-medium text-lg'>Trở thành giảng viên ở </Typography> &nbsp; */}
                            <Typography className='font-extrabold text-lg text-[#3366cc]'>Tạo khóa học mới</Typography>
                        </div>
                        <div className='flex justify-center'>
                            <Typography className=' text-base'>Chia sẻ kiến thức với mọi người</Typography> &nbsp;
                        </div>
                        <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                        <div className='flex min-w-[300px] gap-x-3 justify-between w-full mb-2'>
                            <div className='w-full'>
                                <Typography className='font-normal text-base mb-2'>
                                    Tên khóa học
                                    <span className='text-red-500'>*</span>
                                </Typography>
                                <Input
                                    type="tel"
                                    placeholder="Tên khóa học"
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                                <Typography className='text-red-500'>{errors.name}</Typography>
                            </div>
                        </div>
                        <div className='flex min-w-[300px] gap-x-3 justify-between w-full mb-2'>
                            <div className='w-full'>
                                <Typography className='font-normal text-base mb-2'>
                                    Danh mục
                                    <span className='text-red-500'>*</span>
                                </Typography>
                                <div className='multiselect-container '>
                                    <MultiSelect
                                        value={selectedCategory}
                                        onChange={(e) => handleCategorySelect(e.value)}
                                        options={categoryList} optionLabel="title"
                                        display="chip"
                                        placeholder="Chọn danh mục"
                                        // maxSelectedLabels={3}
                                        className="w-full md:w-20rem" />
                                </div>
                                <Typography className='text-red-500'>{errors.category_ids}</Typography>
                            </div>
                        </div>
                        {/* <div className='mb-5'>
                            <Typography className='font-normal text-base mb-2'>Mô tả về khóa học</Typography>
                            <MyCKEditor className={'max-w-[635px]'}
                                handleData={handleEditorDescription}
                            />
                        </div>
                        <div className='mb-5'>
                            <Typography className='font-normal text-base mb-2'>Yêu cầu khóa học</Typography>
                            <MyCKEditor className={'max-w-[635px]'}
                                handleData={handleEditorRequireMent}
                            />
                        </div> */}
                        <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                        <div
                            onClick={() => handleCreateCourse()}
                            className='h-[50px] relative border group/sort duration-200 hover:opacity-75 bg-[#3366cc] text-white cursor-pointer border-[#829093] flex justify-center items-center'>
                            <Typography className='font-semibold text-base text-white duration-200 '>
                                Tạo
                            </Typography>
                            {processing && (
                                <span className='bg-slate-400 absolute z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                                    <Spinner className='h-auto text-[#fff]' color="cyan" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {processing && (
                    <span className='bg-[#eaeef6] opacity-70 fixed z-10 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                        <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                    </span>
                )}
            </form>
        </>
    );
};

export default LecturerCourseNew

