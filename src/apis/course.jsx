import axios  from "./axios";

export const apiGetCourse=(params)=>axios({
    url:'/course',
    method:'get',
    params,
    // withCredentials: true
})