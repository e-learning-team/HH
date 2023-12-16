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
import CourseLearn from './pages/Courses/CourseLearn';
import { User } from './pages/User/User';
import LecturerRegister from './pages/Lecturer/Lecturer/LecturerRegister';
import LecturerCourse from './pages/Lecturer/Lecturer/LecturerCourse';
import LecturerProfile from './pages/Lecturer/Lecturer/LecturerProfile';
import Lecturer from './pages/Lecturer/Lecturer';
import LecturerCourseNew from './pages/Lecturer/Lecturer/LecturerCourseNew';
import LecturerCourseSave from './pages/Lecturer/Lecturer/LecturerCourseSave';
import Admin from './pages/Admin/Admin'
import AdminUser from './pages/Admin/Admin/AdminUser';
import AdminCategory from './pages/Admin/Admin/AdminCategory';
import VnPayReturn from './pages/Invoice/VnPayReturn';
import LecturerCourseEnroll from './pages/Lecturer/Lecturer/LecturerCourseEnroll';
import AdminInvoice from './pages/Admin/Admin/AdminInvoice';

function App() {
  return (
    <div className=''>
      <Routes>
        <Route path={Path.PUBLIC} element={<Public />}>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.COURSES_DETAIL} element={<CourseDeTail />} />
          <Route path={Path.COURSES} element={<Courses />} />
          <Route path={Path.VNPAY_RETURN} element={<VnPayReturn />} />

          <Route path={Path.USER_P} element={<User />}>
            <Route path={Path.USER_P + Path.USER_PROFILE} element={<UserProfile />} />
            <Route path={Path.USER_P + Path.USER_ENROLLMENT} element={<UserEnrollment />} />
            <Route path={Path.USER_P + Path.USER_BOOKMARK} element={<UserBookmark />} />
            <Route path={Path.USER_P + Path.USER_HISTORY} element={<PaymentHistory />} />
          </Route>
        </Route>

        <Route path={Path.LECTURER_P + Path.LECTURER_REGISTER} element={<LecturerRegister />} />
        
        <Route path={Path.LECTURER_P} element={<Lecturer />}>
          <Route path={Path.LECTURER_P + Path.LECTURER_COURSE} element={<LecturerCourse />} />
          <Route path={Path.LECTURER_P + Path.LECTURER_PROFILE} element={<LecturerProfile />} />
          <Route path={Path.LECTURER_P + Path.LECTURER_SALE} element={<LecturerCourseEnroll />} />
          <Route path={Path.LECTURER_P + Path.LECTURER_NEW_COURSE} element={<LecturerCourseNew/>}/>
          <Route path={Path.LECTURER_P + Path.LECTURER_SAVE_COURSE} element={<LecturerCourseSave/>}/>

          <Route path={Path.LECTURER_P + Path.LECTURER_COURSE_PREVIEW_DETAIL} element={<CourseDeTail />} />
          <Route path={Path.LECTURER_P + Path.LECTURER_COURSE_PREVIEW_LEARN} element={<CourseLearn />} />
        </Route>
        <Route path={Path.ADMIN_P} element={<Admin/>}>
          <Route path={Path.ADMIN_USER} element={<AdminUser/>}/>
          <Route path={Path.ADMIN_COURSE}/>
          <Route path={Path.ADMIN_CATEGORY} element={<AdminCategory/>}/>
          <Route path={Path.ADMIN_SALE} element={<AdminInvoice/>}/>
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
