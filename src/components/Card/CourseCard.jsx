import { NavLink } from "react-router-dom";
import { getVideoThumbnailGoogleGDriveUrl } from "../../utils/Constants";
import { calcRating, extractVideoGoogleGDriveUrlId } from "../../utils/helper";
import { RatingBar } from "../RatingBar/RatingBar";
import noImg from '../../assets/no-image-icon.jpg';
import { Rating, Typography } from "@mui/material";
import { Chip } from "@material-tailwind/react";
import Path from "../../utils/path";

const CourseCard = ({ content }) => {
    const totalRatings = content?.course_ratings;
    return (
        // <NavLink to={`/courses/${content?.slug}`}>
        <div className="border border-[#d1d7dc] mb-6 flex h-[120px]">
            <div className="h-full max-w-[120px] ">
                <img
                    src={content?.video_path ? getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(content?.video_path)) : noImg}
                    className="transition w-full h-full border-none outline-none  object-cover" />
            </div>
            <div className="flex w-full ">
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
                            <Typography className="font-light "> Công khai </Typography>
                        </div>
                    </div>
                </div>

                {content?.courseType == "OFFICIAL" && (
                    <>
                        <div className="flex p-3 h-full min-w-[300px] max-w-[300px]  flex-wrap  flex-col justify-center">
                            <div className="flex  flex-col justify-center">
                                <div className="flex justify-center">
                                    <div>
                                        <Typography className="font-medium "> {(30214).toLocaleString()} </Typography>
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
                                    <Typography className='font-bold text-[#faaf00] '>{4.8}</Typography>
                                    <Rating readOnly value={4.489} precision={0.5} size='small'></Rating>
                                </div>
                                <Typography className='font-light text-[#373632] text-sm'>
                                    <span className='font-medium'>{`(${(48).toLocaleString()}) `}</span>
                                    lượt đánh giá
                                </Typography>
                            </div>
                        </div>
                    </>
                )}
                <div className="flex p-3 h-full w-full flex-col items-center  justify-center">
                    <div className="flex min-w-[145px] flex-col items-start gap-y-2 justify-center">
                        <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                            Preview
                        </Typography>
                        {(content?.courseType == "OFFICIAL" || content?.courseType == "DRAFT") && (
                            <>
                                {content?.courseType == "OFFICIAL" ? (
                                    <>
                                        <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                            <>Chi tiết đăng kí</>
                                        </Typography>
                                        <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                            <>Thu hồi và chỉnh sửa</>
                                        </Typography>
                                    </>
                                ) : (
                                    <NavLink to={`${Path.LECTURER_P + Path.LECTURER_NEW_COURSE + content.id}`}>
                                        <Typography className='cursor-pointer hover:text-[#3366cc] font-medium text-[#373632] text-sm'>
                                            Chỉnh sửa và xuất bản
                                        </Typography>
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
        // </NavLink>
    );
};

export default CourseCard;