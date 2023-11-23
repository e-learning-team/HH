import { NavLink } from "react-router-dom";
import { getVideoThumbnailGoogleGDriveUrl } from "../../utils/Constants";
import { calcRating, extractVideoGoogleGDriveUrlId } from "../../utils/helper";
import { RatingBar } from "../RatingBar/RatingBar";
import noImg from '../../assets/no-image-icon.jpg';
import { Typography } from "@mui/material";

const HorizontalCard = ({ className, content }) => {
    // const totalRatings = calcRating(content?.ratings);
    const totalRatings = content?.course_ratings;
    // console.log(extractVideoGoogleGDriveUrlId(content.video_path));
    return (
        <NavLink to={`/courses/${content.slug}`}>
            <article className="mb-4">
                <div className="cursor-pointer group/item grid sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 pb-4 border-b border-b-[#d1d7dc]">
                    <div id="image lg:col-span-1 md:col-span-1 sm:col-span-1">
                        {/* <img className='h-full w-full bg-cover' src={getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(content.video_path))} /> */}
                        <img
                            alt={content.name}
                            src={content.video_path ? getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(content.video_path)) : noImg}
                            className="transition w-full h-full group-hover/item:opacity-90 object-cover" />
                    </div>
                    <div className="lg:col-span-3 md:col-span-3 sm:col-span-3">
                        <div className="flex h-full">
                            <div className="w-full h-full">
                                <div className="mx-1 flex flex-col justify-between h-full">
                                    <h3 className="font-bold line-clamp-1 group-hover/item:underline">
                                        {content.name ? content.name : (
                                            <>
                                                Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu
                                            </>
                                        )}
                                    </h3>
                                    <p className="text-sm line-clamp-2">
                                        {content.description ? content.description : (
                                            <>
                                                Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu
                                                Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu
                                                Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu
                                            </>
                                        )}

                                    </p>
                                    <div className="mt-2 mb-1">
                                        <div className="text-sm flex justify-start items-center line-clamp-1">
                                            <Typography className='font-bold text-sm'>Tác giả </Typography>&nbsp;&nbsp;
                                            <Typography className='text-sm'>
                                                {content.created_user_info[content.created_by]}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mx-1">
                                        <RatingBar value={totalRatings.averageRate.toFixed(1)} totalReview={totalRatings.totalRatings} />
                                        {/* <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span> */}
                                        <span>•</span>
                                        <span className="text-sm">{content.subscriptions || 0} đã đăng kí.</span>
                                        {/* <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">4.95</p>
                                    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                                    <span className="text-sm font-medium text-gray-900 underline dark:text-white">73 người học</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="mx-1 mt-1.5">
                                <h3 className="font-bold line-clamp-1 w-max">
                                    {content.price_sell ? content.price_sell.toLocaleString() + "₫" : (<>Miễn phí</>)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </NavLink>
    );
};

export default HorizontalCard;