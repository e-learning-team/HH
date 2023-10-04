import React, { useRef, useEffect, useState, useCallback } from 'react';
import Input from "../Input/Input"
import Button from '../Button/Button'
import { NavLink } from 'react-router-dom';
import ContentAlert from '../Alert/ContentAlert'
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import logo from '../../assets/logo.svg'
import { validate } from '../../utils/helper'
import { apiLogin } from "../../apis/user";
import Swal from 'sweetalert2'
import Path from '../../utils/path'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "/node_modules/primeflex/primeflex.css";
import "./Login.css"


const Login = () => {
    const navigate = useNavigate()
    // const dispatch= useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    });
    useEffect(() => {
        document.title = 'Đăng nhập';
    }, []);
    const [invalidFields, setInvalidFields] = useState([])

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
        })
    }
    const handleSubmit = useCallback(async () => {
        const { email, password } = payload
        console.log(payload)
        // const invalids = validate(payload, setInvalidFields)
        // if (invalids === 0) {

        const rs = await apiLogin(payload)
        console.log(rs)
        if (rs.status === 1) {
            navigate(`/${Path.HOME}`)
        } else Swal.fire('Oops!', rs.message, 'error')
        // }

    }, [payload])

    const toast = useRef(null);
    // const login = () => {
    //     toast.current.show({ severity: 'error', summary: 'Lỗi:', detail: 'Sai email hoặc mật khẩu' });
    // };
    return (
        <div className="flex items-center justify-center mt-[80px] h-auto">
            <div className="bg-white p-10 rounded-3xl shadow-lg ring-1 ring-gray-900/5 w-2/6" >
                <div className="text-center jus mb-5">
                    <img src={logo} alt="hyper" height={150} className="mb-3 h-[35px] !w-[100%] flex justify-center" />
                    <div className="text-900 text-3xl font-medium mb-3">Đăng Nhập</div>
                </div>
                <form>
                    <div>
                        <label htmlFor="email" className="block text-900 font-medium mb-1">Email:</label>
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
                        <label htmlFor="password" className="block text-900 font-medium mb-1 mt-3">Mật khẩu:</label>
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
                        <div className="flex align-items-center justify-content-between mb-6 mt-5">
                            <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to="/forgot">Quên mật khẩu</NavLink>
                            <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to={Path.REGISTER}>Đăng ký</NavLink>
                        </div>
                        {/* <ContentAlert content="Sai tên đăng nhập hoặc mật khẩu" style="mb-[10px]" /> */}

                        <Button handleOnClick={handleSubmit} label="Đăng nhập" icon="pi pi-user primary-color" style="inline-block rounded-lg bg-[#29abe2] hover:bg-[#088ab7] px-5 py-3 text-sm font-medium text-white w-full" />
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login