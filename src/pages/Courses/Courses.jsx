import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { Breadcrumbs, Spinner } from "@material-tailwind/react";
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizontalCard from '../../components/Card/HorizontalCard';
import AccordionCourseFilter from '../../components/Accordion/AccordionCourseFilter';
import Pagination from '../../components/Pagination/Pagination';
import { apiGetCourse } from '../../apis/course';
import { Skeleton } from '@mui/material';
import HorizontalSkeletonCard from '../../components/Skeleton/HorizontalSkeletonCard';
const Courses = () => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const searchCourse = async () => {
            try {
                const response = await apiGetCourse({ multi_value: "asd" });
                if (response.data && response.data.data && response.data.data?.length > 0) {
                    console.log(response.data.data.length);
                    console.log("has value");
                    console.log(response.data);
                    setCourseList(response.data);
                }
                else {
                    console.log("empty");
                }
            } catch (error) {
                console.error("Error fetching course data", error);
                // navigate(`/error`);
            } finally {
                setLoading(false);
            }
        };
        searchCourse();
    }, []);
    return (
        <div className="pt-[90px] mb-[80px] justify-center">
            <div className="container mx-auto md:max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="rounded-l lg:col-span-1">
                        <div id="small" className="lg:hidden h-[100px] bg-black">

                        </div>

                        <div id="large" className="hidden lg:block lg:shrink-0 my-5 mx-5">
                            <AccordionCourseFilter />
                        </div>
                    </div>

                    <div className="rounded-lg lg:col-span-3 my-5">
                        {loading ? (
                            <>
                                <HorizontalSkeletonCard />
                                <HorizontalSkeletonCard />
                                <HorizontalSkeletonCard />
                                <HorizontalSkeletonCard />
                            </>
                        ) : (
                            <>
                                {courseList.data.map((course, index) => (
                                    <HorizontalCard key={index} />
                                ))}
                            </>
                        )}

                    </div>
                </div>
                {!loading && (
                    <Pagination />
                )}
            </div>
        </div>

    );
};

export default Courses;