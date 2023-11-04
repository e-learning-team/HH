import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiGetCourse } from "../apis/course";
import axios from 'axios';
import Card from '../components/Card/Card';
const Home = () => {
  return (
    <div className="pt-[120px] mb-[80px] flex justify-center">
        <div className="container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4">
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