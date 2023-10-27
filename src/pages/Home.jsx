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
    loadCourseData()
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
    <div className="flex justify-center">
        <div className="container flex flex-row sm:grid-colz s-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-12 mt-12">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
    </div>
  );
};

export default Home;