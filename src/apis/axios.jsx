import axios from 'axios';
import { apiRefreshToken } from './refreshToken';
import { useDispatch, useSelector } from "react-redux";
import { logout, updateToken } from '../store/User/userSlice';
import { store } from '../store/configureStore';
import { apiLogOut } from './user';
const instance = axios.create({
    baseURL: 'http://localhost:8080/e-learning/api',
    'Content-Type': 'application/json',
});

instance.interceptors.request.use(function (config) {
    const accessToken = store.getState().user.token;
    if (accessToken)
        config.headers = {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
    return config;
}, function (error) {
    console.log("request---" + error);
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {

    return response?.data;
}, async function (error) {
    console.log("response status code---" + error.response.status);
    console.log("response config---" + error.config);
    const prevRequest = error?.config;

    if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const resp =  await apiRefreshToken();
        store.dispatch(updateToken(resp?.data?.token));
        return instance(prevRequest);
    }
    try{
        await apiLogOut();
        store.dispatch(logout())
        prevRequest.headers['authorization'] = null
        return instance(prevRequest);
    }catch(err){
        return Promise.reject(error);

    }

});

export default instance;