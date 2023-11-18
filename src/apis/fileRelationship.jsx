import axios from "./axios";


export const apiUploadFile = (file, params) => axios({
    url: '/file-relationship/upload',
    method: 'post',
    params, // Use the params option here
    data: file,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const apiDeleteFileByPathFile = (params) => axios({
    url:'file-relationship/delete',
    method: 'delete',
    params,
});