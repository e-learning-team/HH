import axios from './axios'
export const apiRefreshToken = () => axios({
    url: '/auth/refresh-token',
    method: 'post',
    withCredentials: true,
});