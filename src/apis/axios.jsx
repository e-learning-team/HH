import axios from 'axios';
import { apiRefreshToken } from './refreshToken';
import { useDispatch, useSelector } from "react-redux";
import { logout, updateToken } from '../store/User/userSlice';
import { store } from '../store/configureStore';
const instance = axios.create({
    baseURL: 'http://localhost:8080/e-learning/api',
    'Content-Type': 'application/json' ,
});
// Interceptor cho yêu cầu trước khi gửi đi
instance.interceptors.request.use(function (config) {
    // Kiểm tra xem có dữ liệu từ local storage được lưu trữ với key 'persist:shop/user' không
    let localStorageData = window.localStorage.getItem('persist:learning/user');
    if (localStorageData && typeof localStorageData === 'string') {
        // // Nếu có dữ liệu, chuyển đổi thành đối tượng JSON
        localStorageData = JSON.parse(localStorageData);
        // // Trích xuất accessToken từ dữ liệu local storage
        const accessToken = JSON.parse(localStorageData?.token);
        // // Thêm header 'Authorization' vào yêu cầu HTTP với token
        if (accessToken)
            config.headers = {
                'Authorization': `Bearer ${accessToken}`,
                // 'Content-Type': 'application/json' 
            };
        return config;
    } else {
        return config; // Nếu không có dữ liệu, không thay đổi yêu cầu
    }
}, function (error) {
    console.log("request---" + error);
    return Promise.reject(error); // Xử lý lỗi nếu có
});

instance.interceptors.response.use(function (response) {

    return response?.data;
}, function (error) {

    // console.log(error.config);
    console.log("response status code---" + error.response.status);
    console.log("response config---" + error.config);
    const prevRequest = error?.config;
    if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        apiRefreshToken()
        .then(res => {
            console.log("response - new token" + res?.data?.token);
            console.log("response - prev Header" + JSON.stringify(prevRequest.headers));
            
            prevRequest.headers = {
                'Authorization': `Bearer ${res?.data?.token}`,
                // 'Content-Type': 'application/json' 
            };
            
            store.dispatch(updateToken(res?.data?.token))
    
            console.log("response - new request" + JSON.stringify(prevRequest.headers));
            console.log("response -  request" + JSON.stringify(prevRequest));
    
            return instance(prevRequest);
        })
        .catch()
        // store.dispatch(logout())
    }
    
    return Promise.reject(error);
});

// Xuất phiên bản Axios tùy chỉnh để có thể sử dụng trong các tệp JavaScript khác
export default instance;