import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import defaultAvatar from '../../assets/user_img.png';
export const initialState = {
    isLoggedIn: false,
    userData: null,
    token: "",
    avatarURL: defaultAvatar,
    roles: [],
    // isLoading: false,
    message: '',
    course_payment: ''
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                userData: action.payload.userData,
                token: action.payload.token,
                roles: action.payload.roles,
                avatarURL: action.payload.avatarURL || defaultAvatar,
            };
        },
        lectureRegister: (state, action) => {
            return {
                ...state,
                userData: action.payload.userData,
                roles: action.payload.roles,
            };
        },
        updateUser: (state, action) => {
            return {
                ...state,
                userData: action.payload.userData,
            };
        },
        // Add a new reducer to update the token
        updateToken: (state, action) => {
            console.log("---update token---");
            console.log(`---${action.payload}---`);
            return {
                ...state,
                token: action.payload && action.payload,
            };
        },
        updateAvatarURL: (state, action) => {
            console.log("---update avatar---");
            console.log(`---${action.payload.avatarURL}---`);
            state.avatarURL = action.payload.avatarURL;
        },
        logout: (state, action) => {
            console.log("---Logout---");
            state.avatarURL = defaultAvatar;
            state.isLoggedIn = false;
            state.token = "";
            state.userData = null;
            state.roles = [];
            state.message = '';
        },
        coursePay : (state, action) => {
            return {
                ...state,
                course_payment: action.payload.course_payment,
            };
        }
    }
});
export const { login, lectureRegister, updateUser, updateToken, updateAvatarURL, logout, coursePay} = userSlice.actions;
export default userSlice.reducer;
export const selectUserToken = (state) => state.user.token;
