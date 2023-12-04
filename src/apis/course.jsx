import axios from "./axios";

export const apiGetCourse = (params) => axios({
    url: '/course/',
    method: 'get',
    params,
    // withCredentials: true
});
export const apiSaveCourse = (data) => axios({
    url: '/course/create',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
});