import React, { useRef, useEffect, useState, useCallback } from 'react';
import Input from "../../components/Input/Input";
import Button from '../../components/Button/Button';
import { NavLink } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo_side from '../../assets/logo-side.svg';
import { apiSendEmailVerification, apiResgister } from "../../apis/user";
import Path from '../../utils/path';
import { toast } from 'react-toastify';
import { login } from '../../store/User/userSlice';
const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, userData, token, message } = useSelector((state) => state.user);
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        code: "",
        full_name: "",
    });
    const [nullEmail, setNullEmail] = useState(true)
    const [isRegister, setIsRegister] = useState(true)
    const [isLoadingSendMail, setIsLoadingSendMail] = useState(false)
    const [isLoadingRegister, setIsLoadingRegister] = useState(false)

    useEffect(() => {
        document.title = 'Đăng ký';
        if (isLoggedIn && isLoggedIn == true) {
            navigate(`/${Path.HOME}`);
        }
        isValidEmail(payload.email) ? setNullEmail(false) : setNullEmail(true);
        payload.email !== "" && payload.full_name !== "" && payload.code !== "" && payload.password !== "" ? (setIsRegister(false)) : setIsRegister(true);
    }, [nullEmail, payload]);

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleSubmit = useCallback(async () => {
        setIsLoadingRegister(true)
        const rs = await apiResgister(payload);
        setIsLoadingRegister(false)
        console.log(rs)
        if (rs.status === 1) {
            console.log(rs.data)
            console.log(rs.data.token)
            toast.success(`Đăng ký thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            dispatch(login({
                isLoggedIn: true,
                userData: rs.data.user,
                token: rs.data.token,
            }));
            navigate(`/${Path.HOME}`);
        } else toast.error(rs.message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }, [payload]);

    const handleSendEmail = useCallback(async () => {
        setIsLoadingSendMail(true)
        const rs = await apiSendEmailVerification(payload)
        setIsLoadingSendMail(false)
        if (rs.status === 1) {
            toast.success(`Đã gửi email xác nhận - vui lòng kiểm tra email của bạn!`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            toast.error(rs.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    }, [payload])
    return (
        <section>
            <div className="w-full">
                <main className="h-screen flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 my-5">
                    <div className="max-w-xl lg:max-w-3xl">
                        <form action="#" className="grid grid-cols-6 gap-6 bg-white p-10 rounded-3xl shadow-lg ring-1 ring-gray-900/5">
                            <div className="col-span-12 text-center jus mb-5">
                                <img src={logo_side} alt="hyper" height={150} className="mb-3 h-[50px] !w-[100%] flex justify-center" />
                                <div className="text-900 text-3xl font-medium mb-3">Đăng Ký</div>
                            </div>
                            <div className="col-span-12">
                                <label className="block text-sm font-medium text-gray-700">Họ Và Tên:</label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    value={payload.full_name}
                                    setValue={setPayload}
                                    nameKey='full_name'
                                    style="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                    placeholder="Họ Và Tên"
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <Input
                                    type="email"
                                    value={payload.email}
                                    setValue={setPayload}
                                    nameKey='email'
                                    style="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                    placeholder="Địa chỉ email"
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="block text-sm font-medium text-gray-700">Mã xác nhận:</label>
                                <div id="code">
                                    <div className="flex rounded-md shadow-sm">
                                        <Input
                                            type="number"
                                            value={payload.code}
                                            setValue={setPayload}
                                            nameKey='code'
                                            disable={nullEmail}
                                            style="w-full rounded-l-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                            placeholder="Mã xác nhận"
                                        />
                                        <Button handleOnClick={handleSendEmail}
                                            label="Gửi mã"
                                            isLoading={isLoadingSendMail}
                                            icon="pi pi-user primary-color"
                                            disable={nullEmail}
                                            style="rounded-r-lg py-3 px-4 w-[115px] inline-flex flex-shrink-0 justify-center items-center gap-2 text-sm rounded-lg text-sm font-medium bg-[#29abe2] hover:bg-[#088ab7] text-white" />

                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
                                <Input
                                    type="password"
                                    value={payload.password}
                                    setValue={setPayload}
                                    nameKey='password'
                                    style="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                    placeholder="Mật khẩu"
                                />
                            </div>
                            <div className="col-span-12">
                                <Button handleOnClick={handleSubmit}
                                    label="Đăng ký" icon="pi pi-user primary-color"
                                    disable={isRegister}
                                    isLoading={isLoadingRegister}
                                    style="inline-block rounded-lg px-5 py-3 text-sm font-medium bg-[#29abe2] hover:bg-[#088ab7] text-white w-full" />
                            </div>
                            <div className="w-[50px] invisible"></div>
                            <div className="col-span-12 text-center flex justify-center">
                                Bạn đã có tài khoản!
                                <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to={Path.LOGIN}>Đăng nhập</NavLink>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
}

export default Register

