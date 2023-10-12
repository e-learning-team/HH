import React, { useRef, useEffect, useState, useCallback } from 'react';
import HoverableTree from '../components/Category/Category';
import { apiGetCourse } from "../apis/course";
import { apiCategory } from "../apis/category";
import axios from 'axios';
import Card from '../components/Card/Card';
const Home = () => {
  const [courseData, setCourseData] = useState([]);
  const loadCourseData = async () => {
    console.log(await apiCategory({ build_type: 'TREE' }).then(res => { return res }));

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
        setCourseData(res.data)
        return res.data;
        // setData(res.data)
      } catch (error) {
        console.error(error);
      }

    };
    categoryDt();
  }, []);

  return (
    <div>
      {/* <HoverableTree /> */}
      {/* ${courseData} */}
      {(courseData).map((c, index) => (
        <div key={index}>
          <span>{c.id}</span>
        </div>
      ))}

      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 mt-10 w-screen">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div> */}
    </div>
  );
};

export default Home;