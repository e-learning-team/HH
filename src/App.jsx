import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Path from './utils/path';
import Public from './pages/Public';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Page404 from './pages/PageNotFound';
import ForgetPasword from './pages/ForgetPassword/ForgetPassword';
import CourseDeTail from './pages/CourseDetail/CourseDetail'
function App() {
  return (
    <div className=''>
      <Routes>
        <Route path={Path.PUBLIC} element={<Public />}>
          <Route path={Path.HOME} element={<Home />} />
        </Route>
        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
