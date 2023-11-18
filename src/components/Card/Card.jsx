import Path from '../../utils/path';
import { NavLink } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import SkeletonCard from '../Skeleton/SkeletonCard';
import noImg from '../../assets/no-image-icon.jpg';
import { getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId } from '../../utils/helper';

import { Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
const Card = ({ content, isEnrolled, enrollmentContent }) => {
    const navigate = useNavigate();

    return (
        <>
            {content ? (
                <NavLink to={`/courses/${content.slug}`}>
                    <div className="shadow-lg justify-center h-auto">
                        <div className=" rounded border-gray-200 bg-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg group/item">
                            <div id="image" className='bg-[#f3f3f3]'>
                                <img
                                    alt={content.name}
                                    src={content.video_path ? getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(content.video_path)) : noImg}
                                    className="aspect-video rounded-t transition group-hover/item:opacity-90 w-full object-scale-down" />
                            </div>
                            <div id="card-content" className='h-auto pb-1'>
                                <div className="mx-1 mt-1.5">
                                    <h3 className="font-bold line-clamp-2 group-hover/item:underline" title={content.name}>
                                        {content.name}
                                    </h3>
                                </div>
                                <div className="mx-1 mt-2 mb-1">
                                    <div className="text-[13px] line-clamp-1" title={content.created_by}>{content.created_by}</div>
                                </div>
                                {/* <RatingBar className="w-full line-clamp-1" value={4.2} totalReview={245} /> */}

                                {isEnrolled ? (
                                    <div className='mx-1 my-3'>
                                        <div className="w-full">
                                            <div className="mb-2 flex flex-col items-center justify-between ">
                                                <progress value={enrollmentContent.percent_complete}
                                                    max="100"
                                                    className="h-1 w-full mb-3" />
                                                <span className='w-full  flex justify-between items-center'>
                                                    <>
                                                        <Typography className='text-[13px] hover:underline' color="blue-gray">
                                                            {enrollmentContent.percent_complete > 0 ? "Hoàn thành" : "BẮT ĐẦU HỌC"}
                                                        </Typography>
                                                        <Typography className='text-[13px]' color="blue-gray">
                                                            {enrollmentContent.percent_complete}%
                                                        </Typography>
                                                    </>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="mb-2 flex flex-col items-center justify-between ">
                                                <span className='w-full  flex justify-between items-center'>
                                                    <>
                                                        <Typography className='text-[13px]' color="blue-gray">
                                                            Giá mua khóa học
                                                        </Typography>
                                                        <Typography className='text-[13px]' color="blue-gray">
                                                            {enrollmentContent.price_purchase ? `đ${enrollmentContent.price_purchase}` : "Miễn phí"}
                                                        </Typography>
                                                    </>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex flex-col items-center justify-between ">
                                                <span className='w-full  flex justify-between items-center'>
                                                    <>
                                                        <Typography className='text-[13px]' color="blue-gray">
                                                            Đánh giá khóa học
                                                        </Typography>
                                                        <Typography className='text-[13px]' color="blue-gray">
                                                            <Rating name="half-rating-read" className=" text-sm " defaultValue={0} precision={0.5} emptyIcon={<StarIcon className="" style={{ stroke: `#faaf00`, opacity: 0.55 }} fontSize="inherit" />} />
                                                        </Typography>
                                                    </>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center mx-3 my-2">
                                        <span className="text-lg font-semibold">₫ 279.000</span>
                                        <span className="text-sm font-light line-through ml-3">₫ 279.000</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </NavLink>
            ) : (
                <SkeletonCard />
            )}
        </>

    );
};

export default Card;