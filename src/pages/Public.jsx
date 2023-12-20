import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { HelmetProvider } from 'react-helmet-async';
const Public = () => {
  return (
    <div>
      <HelmetProvider>
        <Navbar />
        <div className='pt-[80px]'>
          <Outlet />
        </div>
      </HelmetProvider>
    </div>
  );
};

export default Public;