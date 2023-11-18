import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizontalSkeletonCard from "../../../components/Skeleton/HorizontalSkeletonCard";
import SkeletonCard from "../../../components/Skeleton/SkeletonCard";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Path from '../../../utils/path';
import { apiMyEnrollment } from '../../../apis/enrollment';
import { Spinner } from '@material-tailwind/react';
import Card from '../../../components/Card/Card';
const UserEnrollment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    const getMyEnrollment = async () => {
        setLoading(true);
        try {
            const params = {

            };
            const res = await apiMyEnrollment(params);
            if (res && res.data && res.data.data) {
                setEnrollmentData(res.data.data);
            }

        } catch (e) {
            toast.error(`Lỗi ${e.message}`);
        }
        setLoading(false);
    };
    useEffect(() => {
        document.title = "Khóa học đã đăng kí";
        if (!isLoggedIn) {
            toast.error("Bạn cần phải đăng nhập trước", {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`/${Path.HOME}`);
            return;
        }
        getMyEnrollment();
    }, []);
    return (
        <div>
            <h1 className="font-bold text-2xl uppercase">Khóa học đã đăng kí</h1>
            <div className=' w-full my-6'>
                <div className="container mx-1 md:max-w-7xl">
                    <div className="">
                        <div className="flex gap-2 justify-start flex-wrap rounded-lg lg:col-span-3">
                            {loading ? (
                                <div className='w-full flex justify-center'>
                                    <Spinner className='w-[60px] h-auto' color='teal' />
                                </div>
                            ) : ((enrollmentData.length > 0) ? (
                                <>
                                    {enrollmentData.map((enrollment) => (
                                        <div key={enrollment.id} className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '>
                                            <Card content={enrollment.course} isEnrolled={true} enrollmentContent={enrollment} />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEnrollment;