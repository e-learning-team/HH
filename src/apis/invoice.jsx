import axios from './axios'
export const apiGetPaymentUrl = (course_id, customer_id) => axios({
    url: `/invoice/url/${course_id}/${customer_id}`,
    method: 'post'
});

export const apiCreatePayment = (data) => axios({
    url: '/invoice/create',
    method: 'post',
    data,
    headers: {
        'Authorization': ``,
    }
});