import { configureStore } from '@reduxjs/toolkit';
// import appSlice from './app/appSlice';
// import productSlice from './products/productSlice';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer, 
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import userReducer from './User/userSlice';

const persistConfig = {
    key: 'learning/user',
    storage,
  }

export const store = configureStore({
    reducer: {
        user: persistReducer(persistConfig, userReducer)
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
