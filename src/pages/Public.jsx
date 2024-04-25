import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const Public = () => {
  return (
    <div>
      <Navbar />
      <div className=''>
        <Outlet />
      </div>
    </div>
  );
};

export default Public;