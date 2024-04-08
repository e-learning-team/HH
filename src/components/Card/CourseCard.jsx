import { NavLink } from "react-router-dom";
import { getVideoThumbnailGoogleGDriveUrl } from "../../utils/Constants";
import { extractVideoGoogleGDriveUrlId } from "../../utils/helper";
import noImg from '../../assets/no-image-icon.jpg';
import { Rating, Tooltip, Typography } from "@mui/material";
import Path from "../../utils/path";
import { faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { toast } from "react-toastify";
import { apiChangeCourseType, apiDeleteCourse, apiLecturePublishCourse } from "../../apis/course";
import { useDispatch, useSelector } from 'react-redux';

const CourseCard = ({ content, changed }) => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    const totalRatings = content?.course_ratings;
    const [openPublishDialog, setOpenPublishDialog] = useState(false);
    console.log(content?.id, content?.attributes);

    const rejectCourse = async (is_rejected) => {
        let type = content?.courseType;
        if (type == "CHANGE_PRICE" && is_rejected == false) {
            type = "OFFICIAL";
        } else if (type == "CHANGE_PRICE" && is_rejected == true) {
            type = "OFFICIAL";
        } else if (type == "WAITING" && is_rejected == false) {
            type = "OFFICIAL";
        } else if (type == "WAITING" && is_rejected == true) {
            type = "DRAFT";
        }
        const paramsAPI = {
            course_id: content?.id,
            course_type: type,
            is_rejected: is_rejected
        };
        // const paramsAPI = {
        //     course_id: content?.id,
        //     course_type: "OFFICIAL",
        //     is_rejected: is_rejected
        // };
        const response = await apiChangeCourseType(paramsAPI);
        if (response?.status == 1) {
            toast.success("Duyệt khóa học thành công");
        }
        changed && changed(true);
        setOpenPublishDialog(false);
        // console.log(paramsAPI);
    };
    const handleHideCourse = async (is_hide) => {
        const paramsAPI = {
            // course_id: content?.id,
            is_deleted: is_hide
        };
        const response = await apiDeleteCourse(content?.id, paramsAPI);
        if (response?.status == 1) {
            toast.success("Cập nhật thành công");
        }
        changed && changed(true);

    }
    // console.log(content.is_deleted);
    return (
        // <NavLink to={`/courses/${content?.slug}`}>
        <div className="border border-[#d1d7dc] mb-6 flex h-[120px]">
            <div className="h-full max-w-[120px] ">
                <img
                    src={content.image_path ? content.image_path : noImg}
                    className="transition w-full h-full max-w-[120px] max-h-[120px] min-w-[120px] min-h-full border-none outline-none  object-cover" />
            </div>
            <div className="flex w-full h-full">
                <div className="flex p-3  h-full min-w-[340px] max-w-[340px]  flex-col justify-between">
                    <div className="flex-1">
                        <Typography className="font-medium line-clamp-2">
                            {content?.name}
                            {/* Tên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa học
                            Tên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa học
                            Tên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa họcTên khóa học */}
                        </Typography>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <div className="flex gap-x-2">
                            {content?.courseType == "DRAFT" && (
                                <Typography className={`font-medium bg-slate-600 text-sm text-white p-1 px-2 rounded-lg`}> Nháp </Typography>
                            )}
                            {content?.courseType == "OFFICIAL" && (
                                <Typography className={`font-medium bg-[#3366cc] text-sm text-white p-1 px-2 rounded-lg`}> Live </Typography>
                            )}
                            {content?.courseType == "WAITING" && (
                                <Typography className={`font-medium bg-[#f97316] text-sm text-white p-1 px-2 rounded-lg`}> Chờ duyệt </Typography>
                            )}
                            {content?.courseType == "CHANGE_PRICE" && (
                                <Typography className={`font-medium bg-[#f93016] text-sm text-white p-1 px-2 rounded-lg`}> Chờ duyệt giá tiền </Typography>
                            )}
                        </div>
                        <div className="flex gap-x-2">
                            {content?.is_deleted ? (
                                <Typography className="font-light underline italic"> Đã bị ẩn </Typography>
                            ) : (
                                <Typography className="font-light "> Công khai </Typography>
                            )}
                        </div>
                    </div>
                </div>

                {(content?.courseType == "OFFICIAL" || content?.courseType == "CHANGE_PRICE") && (
                    <>
                        <div className="flex p-3 h-full min-w-[300px] max-w-[300px]  flex-wrap  flex-col justify-center">
                            <div className="flex  flex-col justify-center">
                                <div className="flex justify-center">
                                    <div>
                                        <Typography className="font-medium "> {content?.subscriptions?.toLocaleString() || 0} </Typography>
                                        <Typography className="font-light "> Số lượng học viên </Typography>
                                    </div>
                                </div>
                            </div>
                            {/* )} */}
                        </div>
                        <div className="flex p-3 h-full min-w-[300px] max-w-[300px] border-r flex-wrap items-center flex-col justify-center">
                            {/* {content?.courseType == "OFFICIAL" && ( */}
                            <div className="flex gap-x-2 flex-col items-start justify-start">
                                <div className="flex items-center gap-x-2">
                                    <Typography className='font-bold text-[#faaf00] '>{content?.course_ratings?.averageRate?.toFixed(1)}</Typography>
                                    <Rating readOnly value={content?.course_ratings?.averageRate} precision={0.5} size='small'></Rating>
                                </div>
                                <Typography className='font-light text-[#373632] text-sm'>
                                    <span className='font-medium'>{`(${(content?.course_ratings?.totalRatings).toLocaleString()}) `}</span>
                                    lượt đánh giá
                                </Typography>
                            </div>
                        </div>
                    </>
                )}
                <div className="flex p-3 h-full w-full flex-col items-center border-r  justify-center">
                    <div className="flex min-w-[145px] flex-col items-start gap-y-2 justify-center">
                        <NavLink to={`${window.location.pathname.normalize().includes('admin') ? '/admin' : '/lecturer'}/courses/${content?.slug}/preview`}>
                            <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                Preview
                            </Typography>
                        </NavLink>
                        {/* {(content?.courseType) && ( */}
                        <>
                            {content?.courseType == "OFFICIAL" ? (
                                <>
                                    {/* <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                        <>Chi tiết đăng kí</>
                                    </Typography> */}
                                    <NavLink to={`${(window.location.pathname.normalize().includes('admin') ? Path.ADMIN_P : Path.LECTURER_P) + Path.LECTURER_NEW_COURSE + content.id}`}>
                                        <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                            Xem chi tiết
                                        </Typography>
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    {content?.courseType == "DRAFT" ? (
                                        <NavLink to={`${(window.location.pathname.normalize().includes('admin') ? Path.ADMIN_P : Path.LECTURER_P) + Path.LECTURER_NEW_COURSE + content.id}`}>
                                            <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                                Chỉnh sửa và xuất bản
                                            </Typography>
                                        </NavLink>
                                    ) : (
                                        <>
                                            <NavLink to={`${(window.location.pathname.normalize().includes('admin') ? Path.ADMIN_P : Path.LECTURER_P) + Path.LECTURER_NEW_COURSE + content.id}`}>
                                                <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                                    Xem chi tiết
                                                </Typography>
                                            </NavLink>
                                        </>
                                    )}
                                </>
                            )}

                        </>
                        {/* )} */}
                    </div>
                </div>
                {(userData.roles.includes("ROLE_ADMIN") && window.location.pathname.normalize().includes('admin')) && (
                    <div className="min-w-[120px] flex gap-x-2 items-center justify-center">
                        {(content?.courseType == "WAITING" || content?.courseType == "CHANGE_PRICE") && (
                            <>
                                <div onClick={() => setOpenPublishDialog(true)}>
                                    <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                        Duyệt
                                    </Typography>
                                </div>
                                <Dialog
                                    open={openPublishDialog}
                                    onClose={() => setOpenPublishDialog(false)}
                                    aria-labelledby="alert-dialog-title"
                                    width='lg'
                                    aria-describedby="alert-dialog-description" >
                                    <DialogTitle id="alert-dialog-title">
                                        {
                                            <>
                                                <Typography className='font-bold text-lg text-[#9b9b9b]'>Duyệt khóa học: <span className='underline text-black'>{content?.name}</span></Typography>
                                            </>
                                        }
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            <span className='block font-semibold text-lg'>
                                                Với giá:
                                                {(content?.price_sell > 0) ? (
                                                    <>
                                                        &nbsp;<span className='font-bold text-lg text-black underline mx-1'>{(content?.price_sell.toLocaleString())}</span>&nbsp;Vnđ
                                                    </>
                                                ) : (
                                                    <span className='font-bold text-lg text-black'> Miễn phí</span>
                                                )}
                                                {(content?.attributes?.length > 0 && content?.attributes[0]?.attributeValue) ? (
                                                    <div>
                                                    Với giá bán mới:
                                                        &nbsp;<span className='font-bold text-lg text-black underline mx-1'>{content?.attributes[0]?.attributeValue ? (parseInt(content?.attributes[0]?.attributeValue).toLocaleString()) : (content?.price_sell.toLocaleString())}</span>&nbsp;Vnđ
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </span>
                                            {/* <span className='block font-normal text-lg mt-4'>
                                            Xuất bản khóa học sẽ không thể chỉnh sửa lại được.
                                            <br />
                                            Bạn có chắc chắn muốn xuất bản khóa học này?
                                        </span> */}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => rejectCourse(false)} className='hover:opacity-70 text-white bg-[#3366cc] pt-2'>Xác nhận</Button>
                                        <Button onClick={() => rejectCourse(true)} className='hover:opacity-70 text-white bg-orange-500 mr-4 pt-2'>Từ chối</Button>
                                        <Button onClick={() => setOpenPublishDialog(false)} className='hover:opacity-70 text-white bg-red-500 mr-4 pt-2'>Hủy</Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                        <div>
                            {content?.is_deleted ? (
                                <Tooltip title="Hiện" arrow placement='right'>
                                    <span onClick={() => handleHideCourse(false)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </span>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Ẩn" arrow placement='right'>
                                    <span onClick={() => handleHideCourse(true)}>
                                        <FontAwesomeIcon icon={faEyeLowVision} />
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
        // </NavLink>
    );
};

export default CourseCard;