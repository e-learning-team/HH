import React, { useRef, useEffect, useState, useCallback } from 'react';

import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Path from "../../utils/path";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@mui/icons-material';
import { apiCreatePayment } from '../../apis/invoice';
import { extractIdSlug } from '../../utils/helper';
import { coursePay } from '../../store/User/userSlice';
import { Spinner, Typography } from "@material-tailwind/react";
const VnPayReturn = () => {
    const { course_payment, userData } = useSelector((state) => state.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        createPayment();
    }, []);

    const createPayment = async () => {
        document.title = 'Xử lý thanh toán';
        if (course_payment) {
            if (searchParams.get('vnp_ResponseCode') === '00') {
                const data = {
                    courseId: extractIdSlug(course_payment),
                    customerId: userData.id,
                    pricePurchase: searchParams.get('vnp_Amount') / 100,
                    createdBy: userData.id
                };
                const resp = await apiCreatePayment(data);
                if (resp.status !== 0) {
                    toast.success('Thanh toán thành công');
                    console.log(`/courses/learn/${course_payment}`);
                    navigate(`/courses/learn/${course_payment}`);
                } else {
                    toast.error('Đã xảy ra lỗi trong quá trình thanh toán\nvui lòng liên hệ quản trị viên để được hỗ trợ');
                    navigate(`/courses/${course_payment}`);
                }
            } else {
                toast.error('Thanh toán thất bại');
                navigate('/');
            }
        } else {
            navigate('/');
        }
        dispatch(coursePay({ course_payment: '' }));
    };

    return (
        <>
            <div className='fixed top-0 bottom-0 right-0 left-0 justify-center flex justify-center items-center'>
                <div className="gap-6 flex flex-col items-center">
                    <Spinner className='w-20 h-auto' color="teal" />
                    <Typography className='font-medium text-xl animate-bounce [animation-delay:-0.3s]'>Đang xử lý thanh toán</Typography>
                </div>
            </div>
        </>
    );
};
export default VnPayReturn;
