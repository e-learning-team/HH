import axios from "./axios";



export const apiSaveEnrollment = (data) => axios({
    url: '/enrollment/',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
});

export const apiMarkCompleteCourseEnrollment = (enrollment_id, course_id) => axios({
    url: `/enrollment/mark-completed/${enrollment_id}/${course_id}`,
    method: 'post',
    // data: courseId, 
    headers: {
        'Authorization': ``,
    }
});
export const apiUnMarkCompleteCourseEnrollment = (enrollment_id, course_id) => axios({
    url: `/enrollment/mark-completed/${enrollment_id}/${course_id}`,
    method: 'delete',
    headers: {
        'Authorization': ``,
    }
});
export const apiMyEnrollment = (params) => axios({
    url: '/enrollment/my-enrollment',
    method: 'get',
    params, // Use the params option here
    headers: {
        'Authorization': ``,
    }
    // data: file,
    // headers: {
    //     'Content-Type': 'multipart/form-data',
    // },
});
export const apiCheckEnrollment = (course_id) => axios({
    url: `/enrollment/check-enrollment/${course_id}`,
    method: 'get',
    headers: {
        'Authorization': ``,
    }
});
