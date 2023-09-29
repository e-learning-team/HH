import React, { useRef } from 'react'; 
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "/node_modules/primeflex/primeflex.css"
import "./Login.css"

const Login = () => {
    const toast = useRef(null);
    const login = () => {
        toast.current.show({ severity: 'error', summary: 'Lỗi:', detail: 'Sai email hoặc mật khẩu' });
    };
    return (
        <div className="center flex align-items-center justify-content-center" style={{ height: '90vh' }}>
            <div className="card-boder surface-card p-4 shadow-2 border-round w-full lg:w-6" >
                <div className="text-center mb-5">
                    <img src={logo} alt="hyper" height={150} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Đăng Nhập</div>
                </div>

                <div>
                    <label htmlFor="email" className="pl-1 block text-900 font-medium mb-2">Email:</label>
                    <InputText id="email" type="email" placeholder="Địa chỉ Email" className="w-full mb-3" />

                    <label htmlFor="password" className="pl-1 block text-900 font-medium mb-2">Mật khẩu:</label>
                    <InputText id="password" type="password" placeholder="Mật khẩu" className="w-full mb-3" />

                    <div className="flex align-items-center justify-content-between mb-6">
                        <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to="/forgot">Quên mật khẩu</NavLink>
                        <NavLink className="font-medium no-underline ml-2 text-blue-500 text-left cursor-pointer" to="/register">Đăng ký</NavLink>
                    </div>
                    <Toast ref={toast}/>
                    <Button label="Đăng nhập" icon="pi pi-user primary-color" className="w-full" onClick={login}/>
                </div>
            </div>
        </div>
    );
}
export default Login