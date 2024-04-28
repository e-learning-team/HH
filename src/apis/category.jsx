import axios  from "./axios";

export const apiCategory=(params)=>axios({
    url:'/category',
    method:'get',
    params,
    // withCredentials: true
})
export const apiTopCategory=(top)=>axios({
    url:`/category/top-${top}-categories`,
    method:'get',
    // params,
    // withCredentials: true
})
export const apiCreateCategory=(data) =>axios({
    url:'/category/create',
    method:'post',
    data,
    headers: {
        'Authorization': ``,
    }
})

export const apiDeleteCategory=(id) => axios({
    url:`/category/delete/${id}`,
    method:'delete',
    headers: {
        'Authorization': ``,
    }
})

//api update-name 
export const apiUpdateCategoryName=(id,data) => axios({
    url:`/category/update-name/${id}`,
    method:'put',
    data,
    headers: {
        'Authorization': ``,
    }
})
