import axios from "./axios";


export const apiMyEnrollment = ( params) => axios({
    url: '/enrollment/my-enrollment',
    method: 'get',
    params, // Use the params option here
    // data: file,
    // headers: {
    //     'Content-Type': 'multipart/form-data',
    // },
});
export const apiCheckEnrollment = (course_id) => axios({
    url: `/enrollment/check-enrollment/${course_id}`,
    method: 'get',
});
