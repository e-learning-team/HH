const Path = {
    PUBLIC: '/',
    HOME: '',
    COURSES: 'courses/search/:keyword?/:categoryId?',
    COURSES_CATEGORY: 'courses/search/',
    COURSES_DETAIL: `courses/:slug`,
    COURSE_LEARN: 'courses/learn/:slug',
    LOGIN: 'login',
    REGISTER: 'register',
    FORGET_PASSWORD: 'forget-password',
    VNPAY_RETURN: 'vnpay-return',


    //user
    USER_P: "/user/",
    USER_PROFILE: "profile",
    USER_ENROLLMENT: "enrollment",
    USER_BOOKMARK: "bookmark",
    USER_HISTORY: "payment-history",


    //lecture
    LECTURER_P: "/lecturer/",
    LECTURER_PROFILE: "profile",
    // LECTURER_FIRST:'teach-header',
    LECTURER_REGISTER: 'register',
    LECTURER_HOME: "",
    LECTURER_COURSE: "course",
    LECTURER_SALE: "sale",
    LECTURER_NEW_COURSE: "save/",
    LECTURER_SAVE_COURSE: "save/:courseId",
    LECTURER_COURSE_PREVIEW_DETAIL: 'courses/:slug/preview',
    LECTURER_COURSE_PREVIEW_LEARN: 'courses/learn/:slug/preview',

    //admin
    ADMIN_P: "/admin/",
    ADMIN_USER: "user",
    ADMIN_COURSE: "course",
    ADMIN_CATEGORY: "category",
    ADMIN_SAVE_COURSE: "save/:courseId",
    ADMIN_COURSE_PREVIEW_DETAIL: 'courses/:slug/preview',
    ADMIN_COURSE_PREVIEW_LEARN: 'courses/learn/:slug/preview',
}
export default Path