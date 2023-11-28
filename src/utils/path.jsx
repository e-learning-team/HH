const Path={
    PUBLIC:'/',
    HOME:'',
    COURSES:'courses/search/:keyword?/:categoryId?',
    COURSES_CATEGORY:'courses/search/',
    COURSES_DETAIL: `courses/:slug`,
    COURSE_LEARN: 'courses/learn/:slug',
    LOGIN:'login',
    REGISTER:'register',
    FORGET_PASSWORD:'forget-password',


    //user
    USER_P:"/user/",
    USER_PROFILE:"profile",
    USER_ENROLLMENT:"enrollment",
    USER_BOOKMARK:"bookmark",
    USER_HISTORY:"payment-history",


    //lecture
    LECTURER_P: "/lecturer/",
    LECTURER_PROFILE:"profile",
    LECTURER_FIRST:'teach-header',
    LECTURER_REGISTER:'register',
    LECTURER_HOME: "",
    LECTURER_COURSE: "course",
    LECTURER_SAVE_COURSE: "save-course",
}
export default Path