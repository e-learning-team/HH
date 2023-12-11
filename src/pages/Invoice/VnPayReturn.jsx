import React, { useRef, useEffect, useState, useCallback } from 'react';

import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Path from "../../utils/path";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@mui/icons-material';
import { apiCreatePayment } from '../../apis/invoice';
import { extractIdSlug } from '../../utils/helper';
import { coursePay } from '../../store/User/userSlice';
const VnPayReturn = () => {
    const {course_payment, userData} = useSelector((state) => state.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        document.title = 'Xử lý thanh toán';
        if(course_payment) {
            if(searchParams.get('vnp_ResponseCode') === '00') {
                createPayment();
            } else{
                toast.error('Thanh toán thất bại');
            }
        } else {
            navigate('/');
        }
        
    });
    const createPayment = async() => {
        const data = {
            courseId: extractIdSlug(course_payment),
            customerId: userData.id,
            pricePurchase: searchParams.get('vnp_Amount')/100,
            createdBy: userData.id
          }
        const resp = await apiCreatePayment(data);
        dispatch(coursePay({course_payment: ''}))
        if(resp.status !==0) {
            toast.success('Thanh toán thành công');
            
            navigate(`/courses/learn/${course_payment}`)
        } else {
            toast.error('Đã xảy ra lỗi trong quá trình thanh toán\nvui lòng liên hệ quản trị viên để được hỗ trợ');
            navigate(`/courses/${course_payment}`)
        }
    }
    return (
        <>
             
        </>
    );
};
export default VnPayReturn;
