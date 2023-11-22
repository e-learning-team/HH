import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HorizontalCard from '../../components/Card/HorizontalCard';
import AccordionCourseFilter from '../../components/Accordion/AccordionCourseFilter';
import Pagination from '../../components/Pagination/Pagination';
import { apiGetCourse } from '../../apis/course';
import HorizontalSkeletonCard from '../../components/Skeleton/HorizontalSkeletonCard';
const Courses = () => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { keyword } = useParams();
    useEffect(() => {
        console.log("Keyword", keyword);
        document.title = "Tìm kiếm";
        setLoading(true);
        const searchCourse = async () => {
            try {
                const params = {
                    multi_value: keyword || ''
                };
                const response = await apiGetCourse(params);
                if (response.data && response.data.data && response.data.data?.length > 0) {
                    setCourseList(response.data);
                }
                else {
                    // console.log("empty");
                    setCourseList([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course data", error);
                // setLoading(true);
                setCourseList([]);

                // navigate(`/error`);
            } finally {
            }
        };
        searchCourse();
    }, [keyword]);
    // const indexOfLastPage = currentPage * 
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
                                {Array.from({ length: 4 }).map(
                                    (_, index) => <HorizontalSkeletonCard key={index} />
                                )}
                            </>
                        ) : (courseList?.data?.length > 0 ?
                            <>
                                {courseList?.data.map((course, index) => (
                                    <HorizontalCard key={index} content={course} />
                                ))}
                            </>
                            : (
                                <>
                                    Không có kết quả!
                                </>
                            )
                        )}

                    </div>
                </div>
                {!loading && courseList?.data?.length > 0 && (
                    <Pagination totalPages={10} />
                )}
            </div>
        </div>

    );
};

export default Courses;