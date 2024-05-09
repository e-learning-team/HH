import { Skeleton } from "@mui/material";
import { RatingBar } from "../RatingBar/RatingBar";

const HorizontalSkeletonCard = () => {
    return (
        <article className="mb-4">
            <div className=" group/item grid sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 pb-4 border-b border-b-[#d1d7dc]">
                <div id="image lg:col-span-1 md:col-span-1 sm:col-span-1">
                    <Skeleton variant="rounded" className="h-full" />
                </div>
                <div className="lg:col-span-3 md:col-span-3 sm:col-span-3">
                    <div className="flex">
                        <div className="w-full">
                            <div className="mx-1 w-full ">
                                <h3 className="mb-2  font-bold line-clamp-1 group-hover/item:underline">
                                    <Skeleton variant="" className="mr-2" />
                                </h3>
                                <p className="mb-2  text-sm w-full">
                                    <Skeleton variant="" height={40} className="mr-2" />
                                </p>
                                <div className="mt-2 mb-1">
                                    <div className="text-sm line-clamp-1">
                                        <Skeleton variant="" width={100} className="mr-2" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton variant="" width={380} className="" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </article>
    );
};

export default HorizontalSkeletonCard;