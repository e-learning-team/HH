import axios  from "./axios";

export const apiCategory=(params)=>axios({
    url:'/category',
    method:'get',
    params,
    // withCredentials: true
})