import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                build_course_child: false
            };
            const res = await apiMyEnrollment(params);
            if (res?.data?.data) {
                setEnrollmentData(res.data?.data);
                console.log(res.data?.data);
            }

        } catch (e) {
            toast.error(`Lỗi ${e.message}`);
        }
        setLoading(false);
    };
    useEffect(() => {
        document.title = "Khóa học đã đăng ký";
        if (isLoggedIn) {
            //     toast.error("Vui lòng đăng nhập", {
            //         position: toast.POSITION.TOP_RIGHT,
            //     });
            //     navigate(`/${Path.HOME}`);
            //     return;
            // }
            getMyEnrollment();
        }
    }, []);
    return (
        <div>
            <h1 className="font-bold text-2xl uppercase">Khóa học đã đăng ký</h1>
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
                                    <div className='container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4'>
                                        {enrollmentData.map((enrollment) => (
                                            <Card key={enrollment.id} content={enrollment.course} isEnrolled={true} enrollmentContent={enrollment} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div>
                                    Danh sách đăng ký rỗng
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEnrollment;