import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Rating } from "@mui/material";
import { Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import { apiRatingCourse } from "../../apis/rating";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
const labels = {
    1: 'Rất tệ, hoàn toàn không như mong đợi',
    2: 'Kém, khá thất vọng',
    3: 'Trung bình, lẽ ra có thể hay hơn',
    4: 'Tốt, như mong đợi',
    5: 'Tuyệt vời, trên cả mong đợi!',
};

export const CourseRatingDialog = ({ open, setOpen, course, changeRate }) => {
    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);
    const [showText, setShowText] = useState(false);
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = async (event, newValue) => {
        setValue(newValue);
        changeRate && changeRate(newValue);
        try {
            if (newValue && course?.id && userData?.id) {
                // console.log("Call api");
                const data = {
                    user_id: userData.id,
                    course_id: course?.id,
                    rate: newValue
                };
                // console.log("Call api data", data);

                const res = await apiRatingCourse(data);
                if (res.status == 0) {
                    toast.error(e.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else {
                    toast.success(`Đánh giá thành công.`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setShowText(true);
                }

            }
        } catch (e) {
            toast.error(`Đã có lỗi xảy ra`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

    };
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Bạn cần phải đăng nhập trước", {
                position: toast.POSITION.TOP_RIGHT,
            });
            // navigate(`/${Path.HOME}`);
            return;
        }
    }, []);
    return (
        <>
            <Dialog
                className=''
                open={open}
                maxWidth={'sm'}
                fullWidth={true}
                onClose={handleClose}>
                <DialogTitle className='min-w-[15rem] ' id='scroll-dialog-title ' >
                    {
                        <span className='flex items-center justify-between '>
                            <span>
                                {course?.name}
                            </span>
                            <span onClick={handleClose} title="Hủy" className='cursor-pointer  w-[40px] h-[40px] flex justify-center items-center rounded hover:bg-[#eff1f4]'>
                                <FontAwesomeIcon className='' icon={faXmark} />
                            </span>
                        </span>
                    }
                </DialogTitle>
                <DialogContent className=' border-b border-gray-400' dividers={scroll === 'paper'} >
                    <DialogContentText className='min-h-[200px] ' tabIndex={-1} id="scroll-dialog-description">
                        <span className='flex w-full flex-col items-center justify-start mb-6'>
                            <Rating size="large"
                                onChange={(event, newValue) => {
                                    handleChange(event, newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                    setShowText(false);
                                }}
                                className='flex-1' defaultValue={0} precision={1} />
                        </span>
                        <span className='flex w-full flex-col items-center justify-start mb-6'>
                            Hãy đưa ra đánh giá của bạn về khóa học này
                        </span>
                        <span className='flex w-full flex-col items-center justify-start mb-6'>
                            {value !== null && (
                                <>
                                    <span className="text-lg font-bold text-black">{labels[hover !== -1 ? hover : value]}</span>
                                    {showText &&
                                        <span className="text-lg block font-bold text-[#faaf00] mt-3">Cảm ơn bạn đã đánh giá</span>
                                    }
                                </>
                            )}
                        </span>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
};