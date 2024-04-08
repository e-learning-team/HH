import Path from '../../utils/path';
import { NavLink } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import SkeletonCard from '../Skeleton/SkeletonCard';
import noImg from '../../assets/no-image-icon.jpg';
import { getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId } from '../../utils/helper';

import { Rating, Tooltip, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';
import { CourseRatingDialog } from '../Dialog/CourseRatingDialog';
import { useEffect } from 'react';
import { RatingBar } from '../RatingBar/RatingBar';
import StarRatingComponent from 'react-star-rating-component';
const HomeCard = ({ content, isEnrolled, enrollmentContent }) => {
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
                        <a className="cursor-pointer hover: group/item">
                            <img className="aspect-video rounded-t transition group-hover/item:opacity-90 w-full object-cover" alt={content.name}
                                src={content.image_path ? content.image_path : noImg} />
                            <h3 className="font-medium my-4 line-clamp-2" title={content.name}>{content.name}</h3>
                            <div className="text-sm mb-2 font-light">{content.created_user_info[content.created_by]}</div>
                            <div className="flex items-center gap-1 mb-2">
                                <div className="text-sm font-medium">{totalRatings.averageRate.toFixed(1)}</div>
                                {/* <div className="text-[#F77321] flex gap-0.5"><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i></div> */}
                                <StarRatingComponent value={totalRatings.averageRate} editing={false}/>
                                {/* <Rating readOnly value={totalRatings.averageRate} precision={0.5} size='small'></Rating> */}
                                {/* <Rating readOnly  /> */}
                                <div class="text-xs text-[#5C5C5C]">({totalRatings.totalRatings})</div>
                            </div>
                            <div class="flex gap-1.5 items-center mb-2">
                                <div class="text-lg font-medium">{content.price_sell ? (<>{content.price_sell.toLocaleString()} <sup>đ</sup></>) : (<>Miễn phí</>) } </div>
                                {/* <div class="text-sm line-through text-[#929292]">800.000<sup>đ</sup></div> */}
                            </div>  
                        </a>
                    </span>
                </>
            ) : (
                <SkeletonCard />
            )}
        </>
    );
};

export default HomeCard;