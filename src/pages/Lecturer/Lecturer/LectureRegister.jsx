import { Input, Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from "primereact/editor";
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
// import {MyQuillEditor} from '../../../components/Editor/QuillEditor';
const LectureRegister = () => {

    return (
        // <form action='#'>
        <div className='h-full w-full flex justify-center items-center  min-w-[500px]'>
            <div className='shadow-md border flex flex-col rounded-md  min-w-[500px]  p-10'>
                <div className='flex mb-4 min-w-[500px] justify-center'>
                    <Typography className='font-medium text-lg'>Trở thành giảng viên ở </Typography> &nbsp;
                    <Typography className='font-extrabold text-lg text-[#3366cc]'>WISDOM</Typography>
                </div>
                <div className='flex justify-center'>
                    <Typography className=' text-base'>Hãy cho chúng tôi biết thêm về bạn</Typography> &nbsp;
                </div>
                <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                <div className='flex min-w-[300px] gap-x-3 justify-between w-full mb-2'>
                    <div className=''>
                        <Typography className='font-normal text-base mb-2'>Số điện thoại</Typography>
                        <Input
                            type="tel"
                            placeholder="Số điện thoại"
                            className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                    </div>
                    <div className='flex-1'>
                        <Typography className='font-normal text-base mb-2'>Link</Typography>
                        <Input
                            type="tel"
                            placeholder="LinkedIn/Facebook/..."
                            className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                    </div>
                </div>
                <div className='mb-9'>
                    <Typography className='font-normal text-base mb-2'>Mô tả về bản thân</Typography>
                    {/* <Editor onTextChange={(e) => { }} style={{ height: '320px' }} /> */}
                    {/* <MyQuillEditor/> */}
                    <MyCKEditor className={'max-w-[635px]'}/>
                </div>
                <div className='h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer border-[#829093] flex justify-center items-center'>
                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                        Đăng kí
                    </Typography>
                </div>
            </div>
        </div>
        // </form>
    );
};

export default LectureRegister

