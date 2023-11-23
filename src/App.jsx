import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Path from './utils/path';
import Public from './pages/Public';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Page404 from './pages/PageNotFound';
import ForgetPasword from './pages/ForgetPassword/ForgetPassword';
import CourseDeTail from './pages/CourseDetail/CourseDetail';
import Courses from './pages/Courses/Courses';
import UserProfile from './pages/User/UserProfile/UserProfile';
import UserEnrollment from './pages/User/UserProfile/UserEnrollment';
import UserBookmark from './pages/User/UserProfile/UserBookmark';
import PaymentHistory from './pages/User/UserProfile/PaymentHistory';
import { Sidebar } from './components/Navbar/Sidebar';
import CourseLearn from './pages/Courses/CourseLearn';
import { User } from './pages/User/User';
function App() {
  return (
    <div className=''>
      <Routes>
        <Route path={Path.PUBLIC} element={<Public />}>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.COURSES_DETAIL} element={<CourseDeTail />} />
          <Route path={Path.COURSES} element={<Courses />} />
          {/* <Route path={Path.COURSES_CATEGORY} element={<Courses />} /> */}

          <Route path={Path.USER_P} element={<User />}>
            <Route path={Path.USER_P + Path.USER_PROFILE} element={<UserProfile />} />
            <Route path={Path.USER_P + Path.USER_ENROLLMENT} element={<UserEnrollment />} />
            <Route path={Path.USER_P + Path.USER_BOOKMARK} element={<UserBookmark />} />
            <Route path={Path.USER_P + Path.USER_HISTORY} element={<PaymentHistory />} />
          </Route>
        </Route>

        <Route path={Path.COURSE_LEARN} element={<CourseLearn />} />

        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.FORGET_PASSWORD} element={<ForgetPasword />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
