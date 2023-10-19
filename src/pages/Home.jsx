import React, { useRef, useEffect, useState, useCallback } from 'react';
import HoverableTree from '../components/Category/Category';
import { apiGetCourse } from "../apis/course";
import { apiCategory } from "../apis/category";
import axios from 'axios';
import Card from '../components/Card/Card';
const Home = () => {

  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);

  return (
    <div>
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