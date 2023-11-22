import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import axios from 'axios';
import Card from '../components/Card/Card';
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState([]);


  const searchCourse = async () => {
    try {
      const response = await apiGetCourse();
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
    <div className="pt-[120px] mb-[80px] flex justify-center">
      <div className="container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map(
              (_, index) => <Card key={index} />
            )}
          </>
        ) : (courseList.data?.length > 0 ?
          <>
            {courseList.data.map((course, index) => (
              <Card key={index} content={course}  />
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
  );
};

export default Home;