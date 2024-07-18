import { Input, Spinner, Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from "primereact/editor";
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
import { apiLecturerRegister } from '../../../apis/user';
import { lectureRegister, login } from '../../../store/User/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Path from '../../../utils/path';
// import {MyQuillEditor} from '../../../components/Editor/QuillEditor';
const LecturerRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [payload, setPayload] = useState({
        phone_number: '',
        profile_link: '',
        specialization: '',
        description: ''
    });

    const handlePhoneNumberChange = (phoneNumber) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            phone_number: phoneNumber,
        }));
        // console.log("---phoneNumber---", phoneNumber)

    };

    const handleProfileLinkChange = (profileLink) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            profile_link: profileLink,
        }));
        // console.log("---profileLink---", profileLink)
    };
    const handleSpecializationChange = (specialization) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            specialization: specialization,
        }));
        // console.log("---specialization---", specialization)
    }
    const handleEditorData = (editorData) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            description: editorData,
        }));
    };
    const handleRegister = async () => {
        setLoading(true);
        const rs = await apiLecturerRegister(payload);
        console.log("---lecter data----", rs.data);
        if (rs.status === 1) {
            // console.log(rs.data?.user?.avatar)
            dispatch(lectureRegister({
                // isLoggedIn: true,
                userData: rs.data,
                // token: rs.data.token,
                roles: rs.data.roles,
                // avatarURL: rs.data?.user?.avatar,
            }));
            toast.success(`đăng ký tài khoản giảng viên thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`${Path.LECTURER_P + Path.LECTURER_COURSE}`);
        } else {
            toast.error(rs.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    return (
        // <form action='#'>
        <div className='h-full w-full flex justify-center items-center my-8 min-w-[500px]'>
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
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                    </div>
                    <div className='flex-1'>
                        <Typography className='font-normal text-base mb-2'>Link</Typography>
                        <Input
                            type="text"
                            placeholder="LinkedIn/Facebook/..."
                            onChange={(e) => handleProfileLinkChange(e.target.value)}
                            className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                    </div>
                </div>
                <div className='mb-4'>
                    <Typography className='font-normal text-base mb-2'>Chuyên môn</Typography>
                    <Input
                        type="text"
                        placeholder="Chuyên môn"
                        onChange={(e) => handleSpecializationChange(e.target.value)}
                        className="rounded-l-none p-3 outline-none duration-150 focus:bg-white border-gray-300 focus:!border-gray-900" />
                </div>
                <div className='mb-5'>
                    <Typography className='font-normal text-base mb-2'>Mô tả về bản thân</Typography>
                    <MyCKEditor className={'max-w-[635px]'} handleData={handleEditorData} />
                </div>
                <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                <div onClick={() => handleRegister()} className='h-[50px] relative border group/sort duration-200 hover:opacity-75 bg-[#3366cc] text-white cursor-pointer border-[#829093] flex justify-center items-center'>
                    <Typography className='font-semibold text-base text-white duration-200 '>
                        đăng ký
                    </Typography>
                    {loading && (
                        <span className='bg-slate-400 absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center'>
                            <Spinner className='h-auto text-[#fff]' color="cyan" />
                        </span>
                    )}
                </div>
            </div>
        </div>
        // </form>
    );
};

export default LecturerRegister

