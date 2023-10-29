import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { Breadcrumbs } from "@material-tailwind/react";
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizontalCard from '../../components/Card/HorizontalCard';
import AccordionCourseFilter from '../../components/Accordion/AccordionCourseFilter';
import Pagination from '../../components/Pagination/Pagination';
const Courses = () => {

    return (
        <div className="pt-[100px] mb-[80px] justify-center">
            <div className="container mx-auto md:max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="rounded-l lg:col-span-1">
                        <div id="small" className="lg:hidden h-[100px] bg-black">

                        </div>

                        <div id="large" className="hidden lg:block lg:shrink-0 my-5 mx-5">
                            <AccordionCourseFilter/>
                        </div>
                    </div>

                    <div className="rounded-lg  lg:col-span-3 my-5">
                        <HorizontalCard/>
                        <HorizontalCard/>
                        <HorizontalCard/>
                        <HorizontalCard/>
                        <HorizontalCard/>
                        {/* <HorizontalCard/> */}
                    </div>
                </div>
                <Pagination/>
            </div>
        </div>

    )
};

export default Courses;