import React, { useRef, useEffect, useState, useCallback } from 'react';
import Input from "../../components/Input/Input";
import Button from '../../components/Button/Button';
import { NavLink } from 'react-router-dom';
import ContentAlert from '../../components/Alert/ContentAlert';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../store/User/userSlice';
import logo_side from '../../assets/logo-side.svg';
import logo from '../../assets/logo.svg';
import { validate, validateEmail } from '../../utils/helper';
import { apiLogin } from "../../apis/user";
import Swal from 'sweetalert2';
import Path from '../../utils/path';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "/node_modules/primeflex/primeflex.css";
import userReducer from '../../store/User/userSlice';
import { toast } from 'react-toastify';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        email: '',
        password: '',
    });
    const validateFields = () => {
        let valid = true;
        if (!payload.email) {
            setError((prev) => ({ ...prev, email: 'Email không được để trống' }));
            valid = false;
        } else if (!validateEmail(payload.email)) {
            setError((prev) => ({ ...prev, email: 'Email không hợp lệ' }));
            valid = false;
        }
        if (!payload.password) {
            setError((prev) => ({ ...prev, password: 'Mật khẩu không được để trống' }));
            valid = false;
        }


        return valid;
    }
    useEffect(() => {
        document.title = 'Đăng nhập';
        if (isLoggedIn) {
            if (userData?.roles.includes("ROLE_LECTURE")) {
                navigate(`${Path.ADMIN_P}`)
            } else {
                navigate(-1)
            }
        }
    }, [isLoggedIn]);

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
        });
    };
    const handleSubmit = useCallback(async () => {
        if (loading) return;

        if (!validateFields()) return;

        setLoading(true);
        const rs = await apiLogin(payload);
        if (rs.status === 1) {
            // console.log(rs.data?.user?.avatar)
            dispatch(login({
                isLoggedIn: true,
                userData: rs.data.user,
                token: rs.data.token,
                roles: rs.data.roles,
                avatarURL: rs.data?.user?.avatar,
            }));
            // navigate(`/${Path.HOME}`);
            toast.success(`Đăng nhập thành công`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            toast.error(rs.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        setLoading(false);

    }, [payload]);
    return (
        <section>
            <div className="w-screen">
                <main className="flex h-screen items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
                        <form action="#" className="grid grid-cols-6 gap-6 bg-white p-10 rounded-3xl shadow-lg ring-1 ring-gray-900/5">
                            <div className="col-span-12 text-center jus mb-5">
                                <NavLink to={"/"}>
                                    <img src={logo_side} alt="hyper" height={150} className="mb-3 h-[50px] !w-[100%] flex justify-center" />
                                </NavLink>
                                <div className="text-900 text-3xl font-medium mb-3">Đăng Nhập</div>
                            </div>

                            <div className="col-span-12">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                <Input
                                    type="email"
                                    value={payload.email}
                                    setValue={setPayload}
                                    nameKey='email'
                                    invalidFields={invalidFields}
                                    setInvalidFieds={setInvalidFields}
                                    style="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                    placeholder="Địa chỉ email"
                                />
                                {error.email !== '' && <div className='text-red-600 mt-2 ml-2'>{error.email}</div>}

                            </div>

                            <div className="col-span-12">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
                                <Input
                                    type="password"
                                    value={payload.password}
                                    setValue={setPayload}
                                    nameKey='password'
                                    invalidFields={invalidFields}
                                    setInvalidFieds={setInvalidFields}
                                    style="w-full rounded-lg border p-4 pe-12 text-sm shadow-sm focus:outline-gray-200"
                                    placeholder="Mật khẩu"
                                />
                                {error.password !== '' && <div className='text-red-600 mt-2 ml-2'>{error.password}</div>}
                            </div>
                            <div className="col-span-12 flex align-items-center justify-content-between">
                                <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to={'/' + Path.FORGET_PASSWORD}>Quên mật khẩu</NavLink>
                                <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to={'/' + Path.REGISTER}>Đăng ký</NavLink>
                            </div>
                            <div className="col-span-12">
                                <Button
                                    handleOnClick={handleSubmit}
                                    label="Đăng nhập" icon="pi pi-user primary-color"
                                    style="inline-block rounded-lg bg-[#29abe2] hover:bg-[#088ab7] px-5 py-3 text-sm font-medium text-white w-full"
                                    isLoading={loading}
                                    onClick={login} />
                            </div>

                            <div className="col-span-12 h-[0px] invisible">
                                mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
};
export default Login;