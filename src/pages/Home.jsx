import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import banner1 from "../assets/banner-1.svg";
import banner2 from "../assets/banner-2.svg";
import banner3 from "../assets/banner-3.svg";
import { Carousel } from "@material-tailwind/react";
import axios from 'axios';
import Card from '../components/Card/Card';
import Footer from '../components/Footer/Footer';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo-side.svg';
const Home = () => {
  const [loadingRating, setLoadingRating] = useState(true);
  const [loadingSub, setLoadingSub] = useState(true);
  const [highestRatingCourses, setHighestRatingCourses] = useState([]);
  const [highestSubCourses, setHighestSubCourses] = useState([]);

  const buildCouses = async () => {
    try {
      const params = {
        search_type: "OFFICIAL",
        sort_by: "HIGHEST_RATING",
        max_result: "5",
        is_deleted: false
      };
      const response = await apiGetCourse(params);
      if (response.data && response.data.data && response.data.data?.length > 0) {
        setHighestRatingCourses(response.data);
        setLoadingRating(false);
      }
    } catch (error) {
      setLoadingRating(true);
    }

    try {
      const params = {
        search_type: "OFFICIAL",
        sort_by: "HIGHEST_SUB",
        max_result: "5",
        is_deleted: false
      };
      const response = await apiGetCourse(params);
      if (response.data && response.data.data && response.data.data?.length > 0) {
        setHighestSubCourses(response.data);
        setLoadingSub(false);
      }
    } catch (error) {
      setLoadingSub(true);
    }
  };
  useEffect(() => {
    document.title = "Trang chủ";
    buildCouses();
  }, []);


  return (
    <div>
      <Helmet>
        { /* Standard metadata tags */}
        <title>Wisdom E Learning</title>
        <meta name='description' content="Wisdom chia sẻ kiến thức, kết nối đam mê - E Learning Team" />
        { /* End standard metadata tags */}
        { /* Facebook tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Wisdom E Learning" />
        <meta property="og:description" content="Wisdom chia sẻ kiến thức, kết nối đam mê - E Learning Team" />
        <meta property="og:image" content={logo} />
        { /* End Facebook tags */}
      </Helmet>
      <div className="pt-[40px] mb-[80px] lg:mx-32 px-4 grid justify-center gap-6">
        <div className="flex justify-center">
          <Carousel
            className="container w-full"
            navigation={({ setActiveIndex, activeIndex, length }) => (
              <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                      }`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
            autoplay={true}
            autoplayDelay={5000}
            loop={true}
          >
            <img
              src={banner1}
              alt="image 1"
              className="h-full w-full object-cover"
            />
            <img
              src={banner2}
              className="h-full w-full object-cover"
            />
            <img
              src={banner3}
              alt="image 3"
              className="h-full w-full object-cover"
            />
          </Carousel>
        </div>
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <label className="font-bold text-[20px] mb-5">
              Khoá học đăng ký nhiều nhất
            </label>
            <div className=" grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4">
              {loadingSub ? (
                <>
                  {Array.from({ length: 5 }).map(
                    (_, index) => <Card key={index} />
                  )}
                </>
              ) : (highestSubCourses.data?.length > 0 ?
                <>
                  {highestSubCourses.data.map((course, index) => (
                    <Card key={index} content={course} />
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
        </div>
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <label className="font-bold text-[20px] mb-5">
              Khoá học đánh giá cao nhất
            </label>
            <div className=" grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4">
              {loadingRating ? (
                <>
                  {Array.from({ length: 5 }).map(
                    (_, index) => <Card key={index} />
                  )}
                </>
              ) : (highestRatingCourses.data?.length > 0 ?
                <>
                  {highestRatingCourses.data.map((course, index) => (
                    <Card key={index} content={course} />
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;