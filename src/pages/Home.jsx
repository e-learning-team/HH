import React, { useRef, useEffect, useState, useCallback } from 'react';
import HoverableTree from '../components/Category/Category';
import { apiGetCourse } from "../apis/course";
import { apiCategory } from "../apis/category";
import axios from 'axios';

const Home = () => {
  const [courseData, setCourseData] = useState([]);
  const loadCourseData = async () => {
    console.log(await apiCategory({build_type: 'TREE'}).then(res => {return res}));

  };
  useEffect(() => {
    document.title = 'Trang chủ';
    // loadCourseData()
    const categoryDt = async () => {
      try {
        const res = await apiCategory({
          build_type: 'TREE'
        });
        console.log(res);
        return res;
        // setData(res.data)
      } catch (error) {
        console.error(error);
      }
    };
    setCourseData(categoryDt())
  }, []);

  return (
    <div>
      {/* <HoverableTree /> */}
      {/* ${courseData} */}
      {Array.apply(courseData).map((c, index) => (
                <div key={index}>
                    <span>{c.id}</span>
                </div>
            ))}
    </div>
  );
};

export default Home;