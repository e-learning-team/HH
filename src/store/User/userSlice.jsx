import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userData: null,
    token: null,
    // isLoading: false,
    message: ''
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.userData = null;
            state.message = '';
        },
    }
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
