import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

const Public = () => {
  return (
    <div>
        <Navbar/> 
        <Outlet/>
    </div>
  )
}

export default Public