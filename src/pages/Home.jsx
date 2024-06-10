import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import { NavLink, useNavigate } from "react-router-dom";
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
import { apiTopCategory } from '../apis/category';
import { useSelector } from 'react-redux';
import {Helmet} from "react-helmet";


const Home = () => {
  const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loadingRating, setLoadingRating] = useState(true);
  const [loadingSub, setLoadingSub] = useState(true);
  const [highestRatingCourses, setHighestRatingCourses] = useState([]);
  const [highestSubCourses, setHighestSubCourses] = useState([]);
  const [payload, setPayload] = useState({
    keyword: "",
  });
  const [loadingTopCategory, setLoadingTopCategory] = useState(false);
  const [topCategory, setTopCategory] = useState([]);
  const categoryColor = [
    "#FFE8E8",
    "#e9fbfa",
    "#E8F5FF",
    "#E3F9F6",
    "#EEE8FF",
    "#FFF6EB",
    "#E8FFEA",
    '#caf7ec'
  ]
  const categoryHoverColor = [
    "#f5b4b4",
    "#5bbf8a",
    "#CCE4FF",
    "#B3ECE9",
    "#D6C7FF",
    "#FFE8D9",
    "#D7FFD9",
    '#7eab9f'
  ]
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
        max_result: "4",
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
        max_result: "4",
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
  const getTopCategory = async () => {
    setLoadingTopCategory(true);
    try {
      const response = await apiTopCategory(8);
      if (response.status === 1) {
        setTopCategory(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingTopCategory(false);
  }
  useEffect(() => {
    document.title = "Wisdom | Theo đuổi tri thức, phát triển tương lai của bạn.";
    buildCouses();
    getTopCategory();
    // console.log(categoryColor[1])
  }, []);


  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Wisdom</title>
        <meta name="description" content="Theo đuổi tri thức, phát triển tương lai của bạn. Khám phá hàng nghìn khóa học với mức giá thấp nhất chưa từng có! Với các giảng viên chuyên nghiệp, cùng với những khoá học trọn đời!" />
      </Helmet>
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
              {/* <div className="p-inputgroup flex-1">
                <InputText placeholder="Bạn muốn học gì?" className="shadow-none hover:border border-solid hover:border-[#212529]" value={payload.keyword}
                  onChange={e => setPayload(prev => ({ ...prev, keyword: e.target.value }))}
                  onKeyDown={(e) => handleEnter(e)} />
                <Button label="Tìm kiếm " onClick={handleSubmit} className="bg-[#2977ff] border-[#2977ff] border-transparent" />
              </div> */}
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
                <h4 className="text-xl font-bold">Khóa học trực tuyến</h4>
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



      <div className="mb-[80px] lg:mx-32 px-4 grid justify-center gap-6 bg-[url('../assets/insbg.png')] bg-no-repeat">

        {/* most rated course */}
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <div id="rate-course-most">
              <div className="w-full mx-auto max-w-8xl px-4">
                <div className="w-full flex justify-between mb-6">
                  <h4 className="relative uppercase font-semibold text-2xl">
                    Đánh giá cao
                    <span className='absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#1d68da]'></span>
                  </h4>
                  {/* <a className="flex items-center text-sm" href="#">Xem thêm <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </a> */}
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
                        {Array.from({ length: 4 }).map(
                          (_, index) => <Card key={index} />
                        )}
                      </>
                    ) : (highestRatingCourses.data?.length > 0 ?
                      <>
                        {highestRatingCourses.data.map((course, index) => (
                          <SwiperSlide key={index}><HomeCard key={index} content={course} /></SwiperSlide>
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
                <div className="md:grid hidden lg:grid-cols-4 md:grid-cols-2 gap-4">
                  {loadingRating ? (
                    <>
                      {Array.from({ length: 4 }).map(
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
        {/* most sub course */}
        <div className="mt-5 grid justify-center">
          <div className="container grid justify-center">
            <div id="sell-course-most">
              <div className="w-full mx-auto max-w-8xl  px-4">
                <div className=" w-full flex justify-between mb-6">
                  <h4 className="relative uppercase font-semibold text-2xl">
                    Đăng ký nhiều
                    <span className='absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#1d68da]'></span>
                  </h4>
                  {/* <a className="flex items-center text-sm" href="#">Xem thêm <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </a> */}
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
                        {Array.from({ length: 4 }).map(
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
                <div className="md:grid hidden lg:grid-cols-4 md:grid-cols-2 gap-4">
                  {loadingSub ? (
                    <>
                      {Array.from({ length: 4 }).map(
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

        {/* most popular category */}
        <div className="mt-5 grid ">
          <div className="container grid ">
            <div className='w-full mx-auto max-w-8xl px-4'>
              <div className="w-full flex justify-between mb-6">
                <h4 className="relative uppercase font-semibold text-2xl">
                  Danh mục hàng đầu
                  <span className='absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#1d68da]'></span>
                </h4>
              </div>

              <div className="grid lg:grid-cols-4 md:grid-cols-2  grid-cols-1 pt-10 gap-4">
                {loadingTopCategory ? (<></>) : (
                  <>
                    {topCategory?.map((category, index) => (
                      <span key={index} className={` rounded-[8px] transition duration-100 hover:shadow-box6 border-b-4 hover:border-[#4cbdff] border-transparent bg-[${categoryColor[index]}]  hover:bg-[${categoryHoverColor[index]}] text-center px-6 py-[65px] hover:-translate-y-2`}
                        style={{
                          backgroundColor: categoryColor[index],

                        }}
                      // onMouseOver={() => {
                      //   this.style.backgroundcolor = categoryHoverColor[index]
                      // }}
                      >
                        <div className="w-[72px] h-[72px] rounded-full bg-white relative mx-auto flex flex-col justify-center items-center mb-8 group-hover:bg-[#E3F9F6]">
                          <img src={category.image} alt="" className="rounded-full w-[64px] h-[64px] object-contain" />
                        </div>
                        <div className="">
                          <h4 className=" text-2xl  mb-2 font-medium">{category.title}</h4>
                          {category.total_course > 0 && (
                            <p>{category.total_course} Khóa học</p>
                          )}
                        </div>
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid ">
          <div className="container grid ">
            <div className="pt-20 section-padding-bottom bg-white bg-[url('../assets/section-bg-14.png')] bg-center bg-no-repeat 
            bg-cover">
              <div className="px-4 w-full flex justify-between mb-6">
                <h4 className="relative uppercase font-semibold text-2xl">
                  Sự nghiệp
                  <span className='absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#1d68da]'></span>
                </h4>
              </div>
              <div className="container pt-10">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-7">
                  <div className="bg-[url('../assets/bg-ins-1.png')] bg-cover  bg-no-repeat p-10  rounded-md">
                    <div className="max-w-[337px]">
                      {!userData?.roles?.includes("ROLE_LECTURE") ? (
                        <>
                          <div className="mini-title">Chia sẽ kiến thức</div>
                          <div className=" text-[34px] text-black leading-[51px]">
                            Trở thành {' '}
                            <span className="shape-bg">Giảng viên</span>
                          </div>
                          <div className="text-gray-500  mt-6 mb-12">
                            Trở thành giảng viên, chia sẽ kiến thức của bạn.
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mini-title">Quản lý khóa học</div>
                          <div className=" text-[34px] text-black leading-[51px]">
                            Quản lý {' '}
                            <span className="shape-bg">Khóa học</span>
                          </div>
                          <div className="text-gray-500  mt-6 mb-12">
                            Quản lý khóa học của bạn, tạo khóa học mới.
                          </div>
                        </>
                      )}
                      {/* <NavLink to={Path.LECTURER_P} className="block">
                    Giảng dạy trên Wisdom
                  </NavLink> */}
                      <NavLink to={Path.LECTURER_P} className={`btn-career px-[32px] py-[16px] rounded-md bg-[#ff7e84] text-white cursor-pointer `}>
                        {userData?.roles?.includes("ROLE_LECTURE") ? 'Quản lý khóa học' : 'Trở thành giảng viên'}
                      </NavLink>
                    </div>
                  </div>
                  <div className="bg-[url('../assets/bg-ins-2.png')]  bg-no-repeat p-10 bg-cover rounded-md">
                    <div className="max-w-[337px]">
                      <div className="mini-title">Tham gia khóa học, trao đổi kiến thức</div>
                      <div className=" text-[34px] text-black leading-[51px]">
                        Tham gia {' '}
                        <span className="shape-bg">Khóa học</span>
                      </div>
                      <div className="text-gray-500  mt-6 mb-12">
                        Theo đuổi tri thức, phát triển tương lai của bạn.
                      </div>
                      {/* <a href="#" className="btn btn-black">Contact Us</a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;