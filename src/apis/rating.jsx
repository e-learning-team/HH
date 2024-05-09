import axios from "./axios";

export const apiRatingCourse = (data) => axios({
    url: '/rating/',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
})