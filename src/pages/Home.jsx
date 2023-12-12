import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import banner1 from "../assets/banner-1.svg";
import banner2 from "../assets/banner-2.svg";
import banner3 from "../assets/banner-3.svg";
import { Carousel } from "@material-tailwind/react";
import axios from 'axios';
import Card from '../components/Card/Card';
import Footer from '../components/Footer/Footer';
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState([]);


  const searchCourse = async () => {
    try {
      const params = {
        search_type: "OFFICIAL"
      };
      const response = await apiGetCourse(params);
      if (response.data && response.data.data && response.data.data?.length > 0) {
        setCourseList(response.data);
        console.log(response.data);
        setLoading(false);
      }
      else {
        // console.log("empty");
      }
    } catch (error) {
      console.error("Error fetching course data", error);
      setLoading(true);
    } finally {
    }
  };
  useEffect(() => {
    document.title = "Trang chủ";
    searchCourse();
  }, []);


  return (
    <div>
      <div className="pt-[40px] mb-[80px] grid justify-center gap-6">
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
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map(
                    (_, index) => <Card key={index} />
                  )}
                </>
              ) : (courseList.data?.length > 0 ?
                <>
                  {courseList.data.map((course, index) => (
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
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map(
                    (_, index) => <Card key={index} />
                  )}
                </>
              ) : (courseList.data?.length > 0 ?
                <>
                  {courseList.data.map((course, index) => (
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