import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import e from 'cors';
import Path from '../../../utils/path';
import { Spinner, Typography } from '@material-tailwind/react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiUploadFile, apiDeleteFileByPathFile } from '../../../apis/fileRelationship';
import { updateAvatarURL, initialState } from '../../../store/User/userSlice';

const LecturerProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    const [profileLoading, setprofileLoading] = useState(true);
    // let fileInputRef = null;
    const [fileInputRef, setFileInputRef] = useState(null);
    const [img, setImg] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const handleRemoveImg = () => {
        setImg(null);
        if (fileInputRef && fileInputRef.value) {
            fileInputRef.value = ''; // Reset the file input
        }
    };
    const handleImgChange = (e) => {
        setImgLoading(true);
        const file = e.target.files[0];
        if (file) {
            if (file.type.includes("image")) {
                setImg(file);
            } else {
                toast.error("Ảnh không hợp lệ!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                handleRemoveImg();
            }
        }
        setImgLoading(false);
    };
    const deleteAvatar = async () => {
        const params = {
            path_file: avatarURL,
            // parent_type: "USER_AVATAR"
        };
        if (avatarURL !== initialState.avatarURL) {
            try {
                setImgLoading(true);
                const res = await apiDeleteFileByPathFile(params);
                if (res.status == 1) {
                    toast.success(`Xóa ảnh cũ thành công!`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else {
                    toast.error(`Xóa ảnh cũ không thành công thành công! ${res.message}`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                setImgLoading(false);
            } catch (e) {
                console.error('Upload failed:', e);
                setImgLoading(false);
                toast.error(`Xóa ảnh cũ không thành công!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });

            }
        }
    };
    const uploadAvatar = async () => {
        const params = {
            parent_id: userData.id,
            parent_type: "USER_AVATAR"
        };
        try {
            setImgLoading(true);
            const formData = new FormData();
            formData.append('file', img);
            const newAvatarUrl = await apiUploadFile(formData, params);

            if (newAvatarUrl && newAvatarUrl.data?.path_file) {
                dispatch(updateAvatarURL({
                    avatarURL: newAvatarUrl.data?.path_file
                }));
                toast.success("Tải lên thành công!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                handleRemoveImg();
            }
            setImgLoading(false);
        } catch (e) {
            console.error('Upload failed:', e);
            setImgLoading(false);
            toast.error(`Tải lên không thành công!`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };
    const handleUploadImg = async () => {
        if (isLoggedIn && userData && userData.id) {
            if (img) {
                setImgLoading(true);

                await deleteAvatar();
                await uploadAvatar();

                setImgLoading(false);

            } else {
                console.warn('No image selected for upload.');
            }
        }
    };

    const [profilePayload, setProfilePayload] = useState({
        email: "",
        full_name: "",
        address: "",
        phone_number: ""
    });
    useEffect(() => {
        document.title = "Thông tin cá nhân";
        // if (!isLoggedIn) {
        //     toast.error("Vui lòng đăng nhập", {
        //         position: toast.POSITION.TOP_RIGHT,
        //     });
        //     navigate(`/${Path.HOME}`);
        // } else {
        if (userData) {
            setProfilePayload({
                email: userData.email || "",
                full_name: userData.full_name || "",
                address: userData.address || "",
                phone_number: userData.phone_number || ""
            });
        }
        setprofileLoading(false);
        // }
    }, []);
    return (
        <>
            {profileLoading ? (
                <div>
                    <Spinner className='w-[60px] m-auto  object-cover object-center h-auto' color="teal" />
                </div>
            ) : (
                <div className='!mb-40'>
                    <div>
                        <form action='#'>
                            <h1 className="font-bold text-2xl uppercase">Ảnh đại diện</h1>
                            <div className='my-6 max-w-[40rem]'>
                                <div className='w-full min-h-[230px] h-[230px] relative flex border rounded-sm border-[#003a47]'>
                                    <div className='h-full flex justify-center items-center px-8  m-auto w-[240px] max-w-[240px]  bg-[#f0f2f4]'>
                                        {imgLoading ? (
                                            <Spinner className='w-[60px] object-cover object-center h-auto' color="teal" />
                                        ) : (
                                            <img
                                                src={img ? URL.createObjectURL(img) : avatarURL}
                                                className='p-2 h-full object-scale-down object-center'
                                                alt=""
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className='w-full flex justify-between items-center mt-6 relative h-[40px] border rounded-sm border-[#003a47]'>
                                    <div className='mx-3 w-full h-full flex items-center '>
                                        <Typography className='cursor-default'>
                                            {img?.name || "Chưa có file được chọn"}
                                        </Typography>
                                        {img && (
                                            <span onClick={handleRemoveImg} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                                <FontAwesomeIcon className='' icon={faXmark} />
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImgChange}
                                        ref={(fileInput) => (setFileInputRef(fileInput))}
                                    />
                                    <Button handleOnClick={() => fileInputRef && fileInputRef.click()} style="bg-[#003a47] !rounded-none w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" label="Chọn" />
                                </div>
                            </div>

                            <Button disable={!img} handleOnClick={() => handleUploadImg()} style="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white" label="Lưu" rounded />
                        </form>
                    </div>

                    <hr className=" left-0 right-0 my-8 border border-gray-300 !outline-none " />

                    <div>
                        <form action='#'>
                            <h1 className="font-bold text-2xl uppercase">Thông tin cá nhân</h1>
                            <div className='mt-6 flex gap-5 flex-wrap w-full'>
                                <div className='flex-1'>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="email" className='font-medium'>Email</label>
                                        <Input
                                            type="text"
                                            disable={true}
                                            value={profilePayload.email}
                                            // setValue={setPayload}
                                            nameKey='email'
                                            style="w-full rounded-sm !outline !bg-gray-200 !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Email"
                                        />

                                    </div>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="full_name" className='font-medium'>Tên đầy đủ</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.full_name}
                                            // setValue={setPayload}
                                            nameKey='full_name'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Họ Và Tên"
                                        />
                                    </div>
                                </div>


                                <div className='flex-1'>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="full_name" className='font-medium'>Địa chỉ</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.address}
                                            // setValue={setPayload}
                                            nameKey='address'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Địa chỉ"
                                        />
                                    </div>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="email" className='font-medium'>Số điện thoại</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.phone_number}
                                            // setValue={setPayload}
                                            nameKey='email'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button style="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white" label="Lưu" rounded />
                        </form>
                    </div>

                    <hr className=" left-0 right-0 my-8 border border-gray-300 !outline-none " />

                    <div>
                        <form action='#'>
                            <h1 className="font-bold text-2xl uppercase">Thông tin giảng viên</h1>
                            <div className='mt-6 flex gap-5 flex-wrap w-full'>
                                <div className='flex-1'>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="email" className='font-medium'>Số điện thoại</label>
                                        <Input
                                            type="text"
                                            disable={true}
                                            value={profilePayload.email}
                                            // setValue={setPayload}
                                            nameKey='email'
                                            style="w-full rounded-sm !outline !bg-gray-200 !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Email"
                                        />

                                    </div>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="full_name" className='font-medium'>Liên kết</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.full_name}
                                            // setValue={setPayload}
                                            nameKey='full_name'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Họ Và Tên"
                                        />
                                    </div>
                                </div>


                                <div className='flex-1'>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="full_name" className='font-medium'>Địa chỉ</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.address}
                                            // setValue={setPayload}
                                            nameKey='address'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Địa chỉ"
                                        />
                                    </div>
                                    <div className='min-w-[17rem] max-w-[50rem] mb-6 h-auto'>
                                        <label htmlFor="email" className='font-medium'>Số điện thoại</label>
                                        <Input
                                            type="text"
                                            value={profilePayload.phone_number}
                                            // setValue={setPayload}
                                            nameKey='email'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button style="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white" label="Lưu" rounded />
                        </form>
                    </div>

                    <hr className=" left-0 right-0 my-8 border border-gray-300 !outline-none " />
                    <div className=''>
                        <form action="#">
                            <h1 className="font-bold text-2xl uppercase">Mật khẩu</h1>
                            <div className='mt-6 flex gap-5 flex-wrap w-full'>
                                <div className='flex-1'>
                                    <div className='min-w-[17rem] max-w-[30rem] mb-6 h-auto'>
                                        <label htmlFor="" className='font-medium'>Mật khẩu hiện tại</label>
                                        <Input
                                            type="password"
                                            // value={payload.full_name}
                                            // setValue={setPayload}
                                            nameKey='full_name'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Mật khẩu hiện tại"
                                        />
                                    </div>
                                    <div className='min-w-[17rem] max-w-[30rem] mb-6 h-auto'>
                                        <label htmlFor="" className='font-medium'>Mật khẩu Mới</label>
                                        <Input
                                            type="password"
                                            // value={payload.full_name}
                                            // setValue={setPayload}
                                            nameKey='full_name'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Mật khẩu Mới"
                                        />
                                    </div>
                                    <div className='min-w-[17rem] max-w-[30rem] mb-6 h-auto'>
                                        <label htmlFor="" className='font-medium'>Xác nhận mật khẩu mới</label>
                                        <Input
                                            type="password"
                                            // value={payload.full_name}
                                            // setValue={setPayload}
                                            nameKey='full_name'
                                            style="w-full rounded-sm !outline !outline-1 !shadow-lg border p-4 pe-12 text-sm shadow-sm focus:outline-teal-700"
                                            placeholder="Xác nhận mật khẩu mới"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button style="bg-[#003a47] w-[100px] h-[40px] ring-gray-300 hover:opacity-80 text-white" label="Lưu" rounded />
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LecturerProfile;