import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/e-learning/api'
});

// Interceptor cho yêu cầu trước khi gửi đi
instance.interceptors.request.use(function (config) {
    // Kiểm tra xem có dữ liệu từ local storage được lưu trữ với key 'persist:shop/user' không
    let localStorageData = window.localStorage.getItem('persist:shop/user');
    if (localStorageData && typeof localStorageData === 'string') {
        // Nếu có dữ liệu, chuyển đổi thành đối tượng JSON
        localStorageData = JSON.parse(localStorageData);
        // Trích xuất accessToken từ dữ liệu local storage
        const accessToken = JSON.parse(localStorageData?.token);
        // Thêm header 'Authorization' vào yêu cầu HTTP với token
        config.headers = { authorization: `Bearer ${accessToken}` };
        return config;
    } else {
        return config; // Nếu không có dữ liệu, không thay đổi yêu cầu
    }
}, function (error) {
    return Promise.reject(error); // Xử lý lỗi nếu có
});

// Interceptor cho phản hồi từ server
instance.interceptors.response.use(function (response) {
    return response?.data; // Trả về dữ liệu JSON từ phản hồi
}, function (error) {
    return error?.response?.data; // Trả về dữ liệu lỗi nếu có lỗi
});

// Xuất phiên bản Axios tùy chỉnh để có thể sử dụng trong các tệp JavaScript khác
export default instance;