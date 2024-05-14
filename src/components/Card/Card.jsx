import { useNavigate } from "react-router-dom";
import SkeletonCard from '../Skeleton/SkeletonCard';
import noImg from '../../assets/no-image-icon.jpg';

import { Rating, Tooltip, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';
import { CourseRatingDialog } from '../Dialog/CourseRatingDialog';
import { useEffect } from 'react';
import { formatNumberWithDotSeparator } from "../../utils/helper";
const Card = ({ content, isEnrolled, enrollmentContent }) => {
    const totalRatings = content?.course_ratings;

    const navigate = useNavigate();
    const [openCourseRating, setOpenCourseRating] = useState(false);
    const [myRate, setMyRate] = useState(0);
    const [myDeafaultRate, setMyDeafaultRate] = useState(0);
    const handleOpenCourseRating = () => {
        setOpenCourseRating(!openCourseRating);
    };
    const handleChangeRate = (newRate) => {
        if (newRate) {
            setMyRate(newRate);
        } else {
            setMyRate(myDeafaultRate);
        }
    };
    useEffect(() => {
        setMyRate(enrollmentContent?.rating?.rate);
        setMyDeafaultRate(enrollmentContent?.rating?.rate);
    }, []);
    return (
        <>
            {content ? (
                <>
                    <span onClick={(e) => {
                        e.stopPropagation();
                        navigate(isEnrolled ? `/courses/learn/${content.slug}` : `/courses/${content.slug}`);
                    }}>
                        <div className="justify-center h-auto">
                            <div className="shadow-lg  rounded-md border-gray-200 bg-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg group/item">
                                <div id="image" className='bg-[#f3f3f3]'>
                                    <img
                                        alt={content.name}
                                        src={content.image_path ? content.image_path : noImg}
                                        className="aspect-video rounded-t transition group-hover/item:opacity-90 w-full object-cover p-2" />
                                </div>
                                <div id="card-content" className='h-auto pb-1'>
                                    <div className="mx-1 mt-1.5">
                                        <h3 className="font-bold line-clamp-1 group-hover/item:underline" title={content.name}>
                                            {content.name}
                                        </h3>
                                    </div>

                                    <div className="mx-1 mt-2 mb-1">
                                        <div className="text-[13px] w-full flex items-center line-clamp-1" title={content.created_by}>
                                            <Typography className='font-bold text-sm min-w-[46px]'>Tác giả: </Typography>&nbsp;&nbsp;
                                            <Typography className='min-w-[105px] flex justify-end text-sm line-clamp-1'>
                                                {content.created_user_info[content.created_by]}
                                            </Typography>
                                        </div>
                                    </div>
                                    {!enrollmentContent && (
                                        <div className='flex mx-1 items-center gap-1'>
                                            <Typography className='font-bold text-[#faaf00] text-sm'>{totalRatings?.averageRate.toFixed(1)}</Typography>
                                            <Rating readOnly value={totalRatings.averageRate} precision={0.5} size='small'></Rating>
                                            <Typography className='font-light text-sm underline text-gray-500'>({totalRatings?.totalRatings})</Typography>
                                        </div>
                                    )}
                                    {/* <RatingBar className="w-full line-clamp-1" value={4.2} totalReview={245} /> */}

                                    {enrollmentContent ? (
                                        <div className='mx-1 my-3'>
                                            <div className="w-full">
                                                <div className="mb-2 flex flex-col items-center justify-between ">
                                                    <progress value={enrollmentContent.percent_complete}
                                                        max="100"
                                                        className="h-1 w-full mb-3" />
                                                    <span className='w-full  flex justify-between items-center'>
                                                        <>
                                                            <span to={`/courses/learn/${content.slug}`}>
                                                                <Typography className='text-[13px] hover:underline font-bold' color="blue-gray">
                                                                    {enrollmentContent.percent_complete == 100 ? "Hoàn thành" : "BẮT ĐẦU HỌC"}
                                                                </Typography>
                                                            </span>
                                                            <Typography className='text-[13px]' color="blue-gray">
                                                                {enrollmentContent.percent_complete}%
                                                            </Typography>
                                                        </>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div className="mb-2 flex flex-col items-center justify-between line-clamp-1">
                                                    <span className='w-full  flex justify-between items-center'>
                                                        {/* <> */}
                                                        <Typography className='text-[13px] min-w-[108px] text-black font-bold' color="blue-gray">
                                                            Giá mua khóa học
                                                        </Typography>
                                                        <Typography className='text-[13px] flex justify-end min-w-[70px]' color="blue-gray">
                                                            {(enrollmentContent.price_purchase > 0) ? formatNumberWithDotSeparator(enrollmentContent.price_purchase) + "₫" : (<>Miễn phí</>)}
                                                        </Typography>
                                                        {/* </> */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div className="flex flex-col items-center justify-between ">
                                                    <span className='w-full  flex justify-between items-start'>
                                                        <Typography className='text-[13px] line-clamp-1 text-black font-bold' color="blue-gray">
                                                            Đánh giá khóa học
                                                        </Typography>
                                                        <Tooltip title="Thay đổi đánh giá" placement="bottom" className='min-w-[100px] hover:border-b'>
                                                            <Typography
                                                                className='text-[13px] gap-1 flex flex-col items-end justify-end' color="blue-gray">
                                                                <Rating name="half-rating-read" readOnly className=" text-sm " value={myRate} precision={0.5} emptyIcon={<StarIcon className="" style={{ stroke: `#faaf00`, opacity: 0.55 }} fontSize="inherit" />} />
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setOpenCourseRating(true);
                                                                    }}
                                                                    className='text-black font-medium'>
                                                                    Thay đổi
                                                                </span>
                                                            </Typography>
                                                        </Tooltip>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center mx-1 my-2">
                                            <span className="text-lg font-semibold">
                                                {content.price_sell ? content.price_sell.toLocaleString() + "₫" : (<>Miễn phí</>)}
                                            </span>

                                            {/* <span className="text-sm font-light line-through ml-3">₫ 279.000</span> */}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </span>
                    {openCourseRating && (
                        <CourseRatingDialog preventDefault open={openCourseRating} setOpen={handleOpenCourseRating} course={{ id: content.id, name: content.name }} changeRate={handleChangeRate} />
                    )}
                </>
            ) : (
                <SkeletonCard />
            )}
        </>
    );
};

export default Card;