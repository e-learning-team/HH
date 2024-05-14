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

export const apiSendForgetPassword = (data) => axios({
    url: '/user/password/reset',
    method:'post',
    data
})
export const apiConfirmForgetPassword = (data) => axios({
    url: '/user/password/reset',
    method:'patch',
    data
})
export const apiProfileUpdate = (data) => axios({
    url: '/user/profile/update',
    method: 'patch',
    data,
    headers: {
        'Authorization': ``,
    }
})
export const apiLecturerRegister = (data) => axios({
    url: '/user/lecturer/register',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
})
export const apiUserDetail = (userId) => axios({
    url: `/user/detail/${userId}`,
    method: 'get',
    // data,
})

export const apiUserList = (params) => axios({
    url: '/user/',
    method: 'get',
    params,
})

export const apiUpdateStatus = (userId, params) => axios({
    url: `/user/lock/${userId}`,
    method: 'post',
    params,
    headers: {
        'Authorization': ``,
    }
})

export const apiUpdateRoles = (userId, params) => axios( {
    url: `/user/update-roles/${userId}`,
    method: 'put',
    params,
    headers: {
        'Authorization': ``,
    }
})
export const apiProfileUpdatePassword = (id, data) => axios({
    url: `/user/update-password/${id}`,
    method: 'put',
    data,
    headers: {
        'Authorization': ``,
    }
})