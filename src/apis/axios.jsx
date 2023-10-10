import axios from 'axios';
import { apiRefreshToken } from './refreshToken';
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from '../store/User/userSlice';

const instance = axios.create({
    baseURL: 'http://localhost:8080/e-learning/api',
});
const updateAccessTokenRedux = (token) => {
    const dispatch = useDispatch();

    dispatch(updateToken(token))
}
// Interceptor cho yêu cầu trước khi gửi đi
instance.interceptors.request.use(function (config) {
    // Kiểm tra xem có dữ liệu từ local storage được lưu trữ với key 'persist:shop/user' không
    // let userData = useSelector((state) => state.user.token)
    // console.log("1"+userData)
    let localStorageData = window.localStorage.getItem('persist:learning/user');
    if (localStorageData && typeof localStorageData === 'string') {
        // // Nếu có dữ liệu, chuyển đổi thành đối tượng JSON
        localStorageData = JSON.parse(localStorageData);
        // // Trích xuất accessToken từ dữ liệu local storage
        const accessToken = JSON.parse(localStorageData?.token);
        // console.log("2"+accessToken)
        // // Thêm header 'Authorization' vào yêu cầu HTTP với token
        if (accessToken)
            config.headers = {
                authorization: `Bearer ${accessToken}`,
                // 'Access-Control-Allow-Origin': "*"
            };
        return config;
    } else {
        return config; // Nếu không có dữ liệu, không thay đổi yêu cầu
    }
}, function (error) {
    console.log("request---" + error);
    // return error;
    return Promise.reject(error); // Xử lý lỗi nếu có
});
// Interceptor cho phản hồi từ server
// instance.interceptors.response.use(function (response) {
//     return response?.data; // Trả về dữ liệu JSON từ phản hồi
// }, async (error) => {
//     // const prevRequest = error?.config
//     // console.log("request config---" + JSON.stringify(prevRequest))
//     console.log("request---" + error?.response?.status)

//     return error?.response?.data; // Trả về dữ liệu lỗi nếu có lỗi
// });
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response)
    return response?.data;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.config);
    console.log("response status code---" + error.response.status);
    console.log("response config---" + error.config);
    const prevRequest = error?.config;
    if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const newAccessToken = await apiRefreshToken();
        console.log("response - new token" + newAccessToken?.data.token);
        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken?.data?.token}`;
        
        updateAccessTokenRedux(newAccessToken?.data?.token)

        console.log("response - prev Header" + JSON.stringify(prevRequest.headers));

        return instance(prevRequest);
    }
    return Promise.reject(error);
});

// Xuất phiên bản Axios tùy chỉnh để có thể sử dụng trong các tệp JavaScript khác
export default instance;