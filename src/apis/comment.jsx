import axios from "./axios";

export const apiGetComment = (params) => axios({
    url: '/comment',
    method: 'get',
    params,
    // headers: {
    //     'Authorization': ``,
    // }
})
export const apiPostComment = (data) => axios({
    url: '/comment',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
})

export const apiDeleteComment = (id) => axios({
    url: `/comment/${id}`,
    method: 'delete',
    headers: {
        'Authorization': ``,
    }
})