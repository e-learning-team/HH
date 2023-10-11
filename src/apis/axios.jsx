import axios from 'axios';
import { apiRefreshToken } from './refreshToken';
import { useDispatch, useSelector } from "react-redux";
import { logout, updateToken } from '../store/User/userSlice';
import { store } from '../store/configureStore';
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
}, function (error) {

    console.log("response status code---" + error.response.status);
    console.log("response config---" + error.config);
    const prevRequest = error?.config;
    if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        apiRefreshToken()
            .then(res => {
                store.dispatch(updateToken(res?.data?.token));
                // prevRequest.headers['authorization'] = 'Bearer ' + res?.data?.token;
                return instance(prevRequest);
            });
    }

    return Promise.reject(error);
});

export default instance;