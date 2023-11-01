import React from "react";
import { Typography } from "@material-tailwind/react";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import clsx from "clsx";

export function RatingBar({ value, totalReview, className }) {
    const [rated, setRated] = React.useState(Math.round(value));

    return (
        <div className={`${className} flex items-center gap-2 text-sm`}>
            <span className="text-[#faaf00] font-semibold">{value}</span>
            {/* <Rating value={value} onChange={(value) => setRated(value)} /> */}
            <Rating name="half-rating-read" className=" text-sm " defaultValue={value} precision={0.5}  readOnly emptyIcon={<StarIcon className="" style={{ stroke: `#faaf00`, opacity: 0.55 }} fontSize="inherit" />} />
            <Typography color="blue-gray" className="font-normal  text-sm ">
                <span className="text-[#64ceeb]">
                    ({totalReview} lượt đánh giá)
                </span>
            </Typography>
        </div>
    );
}