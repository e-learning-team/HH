import { logout } from "../store/User/userSlice";
import { store } from "../store/configureStore";
import axios from "./axios";

export const apiResgister = (data) => axios({
    url: '/auth/register',
    method: 'post',
    data,
    withCredentials: true,
});

export const apiLogin = (data) => axios({
    url: '/auth/login',
    method: 'post',
    data,
    withCredentials: true,
});

export const apiLogOut = () => axios({
    url: '/auth/logout',
    method: 'post',
    withCredentials: true,
});

export const apiSendEmailVerification = (data) => axios({
    url: '/auth/email/verify',
    method: 'post',
    data
})

