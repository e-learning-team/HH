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
import './style.css';
// import {MyQuillEditor} from '../../../components/Editor/QuillEditor';
const LecturerCourseSave = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categoryNodes, setCategoryNodes] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
        try {
            const categoryData = await apiCategory({ build_type: 'LIST' });
            const data = addDashesToTitles(categoryData.data);
            setCategoryList(data);

            console.log(data);
            // categoryData.data.then((data) => setCategoryNodes(data))
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        fetchCategory();
    }, []);
    return (
        // <form action='#'>
        <div className='h-full w-full flex justify-center items-center my-8 min-w-[500px]'>
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
                        <Typography className='font-normal text-base mb-2'>Tên khóa học</Typography>
                        <Input
                            type="tel"
                            placeholder="Tên khóa học"
                            // onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                    </div>
                </div>
                <div className='flex min-w-[300px] gap-x-3 justify-between w-full mb-2'>
                    <div className='w-full'>
                        <Typography className='font-normal text-base mb-2'>Danh mục</Typography>
                        <div className='multiselect-container '>
                            <MultiSelect
                                
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.value)}
                                options={categoryList} optionLabel="title"
                                display="chip"
                                placeholder="Chọn danh mục"
                                // maxSelectedLabels={3}
                                className="w-full md:w-20rem" />
                        </div>
                    </div>
                </div>
                <div className='mb-5'>
                    <Typography className='font-normal text-base mb-2'>Mô tả về khóa học</Typography>
                    <MyCKEditor className={'max-w-[635px]'}
                    // handleData={handleEditorData} 
                    />
                </div>
                <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                <div
                    // onClick={() => handleRegister()}
                    className='h-[50px] relative border group/sort duration-200 hover:opacity-75 bg-[#3366cc] text-white cursor-pointer border-[#829093] flex justify-center items-center'>
                    <Typography className='font-semibold text-base text-white duration-200 '>
                        Tạo
                    </Typography>
                    {/* {loading && (
                        <span className='bg-slate-400 absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center'>
                            <Spinner className='h-auto text-[#fff]' color="cyan" />
                        </span>
                    )} */}
                </div>
            </div>
        </div>
        // </form>
    );
};

export default LecturerCourseSave

