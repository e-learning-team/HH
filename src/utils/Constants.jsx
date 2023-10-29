import path from './path'
export const getVideoGoogleGDriveUrl = (videoId) => `https://drive.google.com/file/d/${videoId}/preview`;
export const getVideoThumbnailGoogleGDriveUrl = (videoId) => `https://drive.google.com/thumbnail?id=${videoId}`;
// import path from './path'
// export const navigation=[
//     {
//         id:1,
//         value:'HOME',
//         path:`/${path.HOME}`
//     },
//     {
//         id:2,
//         value:'COURSES',
//         path:`/${path.COURSES}`
//     },
//     {
//         id:3,
//         value:'LOGIN',
//         path:`/${path.LOGIN}`
//     },
//     {
//         id:4,
//         value:'REGISTER',
//         path:`/${path.REGISTER}`
//     },
//     {
//         id:5,
//         value:'FORGET_PASSWORD',
//         path:`/${path.FORGET_PASSWORD}`
//     },
// ]