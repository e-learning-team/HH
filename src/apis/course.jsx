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

export const apiLecturePublishCourse = (params) => axios({
    url: `/course/lecturer/change-course-type`,
    method: 'put',
    params,
    headers: {
        'Authorization': ``,
    }
});