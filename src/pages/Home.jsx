import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import { useNavigate } from "react-router-dom";
import Path from '../utils/path';
import banner1 from "../assets/banner-1.svg";
import banner2 from "../assets/banner-2.svg";
import banner3 from "../assets/banner-3.svg";
import { Carousel } from "@material-tailwind/react";
import axios from 'axios';
import Card from '../components/Card/Card';
import HomeCard from '../components/Card/HomeCard';
import Footer from '../components/Footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/home.css'
import {
  faBook,
  faCheck,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
const Home = () => {
  const navigate = useNavigate();
  const [loadingRating, setLoadingRating] = useState(true);
  const [loadingSub, setLoadingSub] = useState(true);
  const [highestRatingCourses, setHighestRatingCourses] = useState([]);
  const [highestSubCourses, setHighestSubCourses] = useState([]);
  const [payload, setPayload] = useState({
    keyword: "",
  });

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const trimmedKeyword = payload.keyword.trim();
    console.log(trimmedKeyword)
    const params = new URLSearchParams(window.location.search);
    params.set('keyword', trimmedKeyword);
    if (!payload.keyword) {
      params.delete('keyword');
      params.delete('category');
      params.delete('subcategory');
    } else {
      setPayload({ keyword: trimmedKeyword });
    }
    const newPath = `${Path.COURSES_CATEGORY}?${params.toString()}`;
    navigate(newPath);
  };

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
      {/* <div className="pt-[40px] lg:mx-32 px-4 grid justify-center gap-6">
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
      </div> */}

      <div id="home-banner-area" className="">
        <div className="md:flex hidden home-banner justify-center">
          <div className="container lg:mx-32 relative">
            <div className="max-w-[490px] leading-16 px-4">
              <h2 className="text-5xl font-bold mb-4">Nền tảng học online tốt nhất</h2>
              <p className="text-base mb-12">Khám phá hàng nghìn khóa học với mức giá thấp nhất chưa từng có!</p>
                <div className="p-inputgroup flex-1">
                  <InputText placeholder="Bạn muốn học gì?" className="shadow-none hover:border border-solid hover:border-[#212529]" value={payload.keyword}
                    onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))}
                    onKeyDown={(e) => handleEnter(e)} />
                  <Button label="Tìm kiếm " onClick={handleSubmit} className="bg-[#2977ff] border-[#2977ff] border-transparent" />
                </div>
            </div>
          </div>
        </div>
        <div className="md:hidden pt-[50px] pb-10 flex justify-center">
          <div className="container lg:mx-32 relative">
            <div className="max-w-[490px] leading-16 px-4">
              <h2 className="text-5xl font-bold mb-4 text-center">Nền tảng học online tốt nhất</h2>
              <p className="text-base mb-12 text-center">Khám phá hàng nghìn khóa học với mức giá thấp nhất chưa từng có!</p>
              <div className="p-inputgroup flex-1">
                <InputText placeholder="Bạn muốn học gì?" className="shadow-none hover:border border-solid hover:border-[#212529]" />
                <Button label="Tìm kiếm " className="bg-[#2977ff] border-[#2977ff] border-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 py-[30px] bg-gradient-to-r from-[#f7b9b9] to-[#afe6f0]">
        <div className="flex justify-center">
          <div className="container lg:mx-32 gap-4 px-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div className="bg-white p-5 rounded-lg w-full flex items-center">
              <a className="bg-[#29aae1] rounded-[50%] h-[45px] w-[45px] text-20 leading-[50px] text-center">
                <FontAwesomeIcon className='leading-[45px] text-center text-[20px] text-white' icon={faBook} />
              </a>
              <div className="py-[10px] pl-[13px]">
                <h4 className="text-xl font-bold">409 Khóa học trực tuyến</h4>
                <p className="text-sm text-[#9f9f9f]">Khám phá nhiều chủ đề mới</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg w-full flex items-center">
              <a className="bg-[#29aae1] rounded-[50%] h-[45px] w-[45px] text-20 leading-[50px] text-center">
                <FontAwesomeIcon className='leading-[45px] text-center text-[20px] text-white' icon={faCheck} />
              </a>
              <div className="py-[10px] pl-[13px]">
                <h4 className="text-xl font-bold">Giảng viên kinh nghiệm</h4>
                <p className="text-sm text-[#9f9f9f]">Tìm khóa học phù hợp với bạn</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg w-full flex items-center">
              <a className="bg-[#29aae1] rounded-[50%] h-[45px] w-[45px] text-20 leading-[50px] text-center">
                <FontAwesomeIcon className='leading-[45px] text-center text-[20px] text-white' icon={faClock} />
              </a>
              <div className="py-[10px] pl-[13px]">
                <h4 className="text-xl font-bold">Truy cập trọn đời</h4>
                <p className="text-sm text-[#9f9f9f]">Học theo lịch trình của bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[80px] lg:mx-32 px-4 grid justify-center gap-6">
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <div id="sell-course-most">
              <div className="w-full mx-auto max-w-8xl  px-4">
                <div className="w-full flex justify-between mb-6">
                  <h4 className="uppercase font-semibold text-2xl">Đăng ký nhiều nhất</h4>
                  <a className="flex items-center text-sm" href="#">Xem thêm <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </a>
                </div>
                <div className="md:hidden">
                  <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    className="mySwiper"
                  >
                    {loadingSub ? (
                      <>
                        {Array.from({ length: 8 }).map(
                          (_, index) => <HomeCard key={index} />
                        )}
                      </>
                    ) : (highestSubCourses.data?.length > 0 ?
                      <>
                        {highestSubCourses.data.map((course, index) => (
                          <SwiperSlide key={index}><HomeCard content={course} /></SwiperSlide>

                        ))}
                      </>
                      : (
                        <>
                          Không có kết quả!
                        </>
                      )
                    )}

                  </Swiper>
                </div>
                <div className="md:grid hidden lg:grid-cols-5 md:grid-cols-2 gap-4">
                  {loadingSub ? (
                    <>
                      {Array.from({ length: 8 }).map(
                        (_, index) => <HomeCard key={index} />
                      )}
                    </>
                  ) : (highestSubCourses.data?.length > 0 ?
                    <>
                      {highestSubCourses.data.map((course, index) => (
                        <HomeCard key={index} content={course} />
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
        </div>
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <div id="rate-course-most">
              <div className="w-full mx-auto max-w-8xl px-4">
                <div className="w-full flex justify-between mb-6">
                  <h4 className="uppercase font-semibold text-2xl">Đánh giá cao</h4>
                  <a className="flex items-center text-sm" href="#">Xem thêm <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="black"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </a>
                </div>
                <div className="md:hidden">
                  <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    className="mySwiper"
                  >
                    {loadingRating ? (
                      <>
                        {Array.from({ length: 8 }).map(
                          (_, index) => <Card key={index} />
                        )}
                      </>
                    ) : (highestRatingCourses.data?.length > 0 ?
                      <>
                        {highestRatingCourses.data.map((course, index) => (
                          <SwiperSlide  key={index}><HomeCard content={course} /></SwiperSlide>
                        ))}
                      </>
                      : (
                        <>
                          Không có kết quả!
                        </>
                      )
                    )}

                  </Swiper>
                </div>
                <div className="md:grid hidden lg:grid-cols-5 md:grid-cols-2 gap-4">
                  {loadingRating ? (
                    <>
                      {Array.from({ length: 8 }).map(
                        (_, index) => <Card key={index} />
                      )}
                    </>
                  ) : (highestRatingCourses.data?.length > 0 ?
                    <>
                      {highestRatingCourses.data.map((course, index) => (
                        <HomeCard key={index} content={course} />
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;