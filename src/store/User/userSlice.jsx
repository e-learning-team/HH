import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import defaultAvatar from '../../assets/user_img.png';
export const initialState = {
    isLoggedIn: false,
    userData: null,
    token: "",
    avatarURL: defaultAvatar,
    roles: [],
    // isLoading: false,
    message: ''
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
        // Add a new reducer to update the token
        updateToken: (state, action) => {
            console.log("---update token---");
            // console.log(`---${action.payload}---`);
            state.token = action.payload;
        },
        updateAvatarURL: (state, action) => {
            console.log("---update avatar---");
            console.log(`---${action.payload.avatarURL}---`);
            state.avatarURL = action.payload.avatarURL;
        },
        logout: (state, action) => {
            state.avatarURL = defaultAvatar;
            state.isLoggedIn = false;
            state.token = "";
            state.userData = null;
            state.roles = [];
            state.message = '';
        },
    }
});
export const { login, updateToken, updateAvatarURL, logout } = userSlice.actions;
export default userSlice.reducer;
export const selectUserToken = (state) => state.user.token;
